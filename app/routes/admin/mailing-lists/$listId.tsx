import * as React from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/lib/session.server";
import invariant from "tiny-invariant";
import { InputText } from "~/ui/input";
import { getEmailList, updateEmailList } from "~/models/email-list.server";

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["name", { label: "List Name", required: true, type: "text" }],
]);

export async function loader({ request, params }: LoaderFunctionArgs) {
	let { listId } = params;
	invariant(listId, "List ID is required");
	await requireUserId(request);
	let list = await getEmailList(listId);
	if (!list) {
		throw json(null, { status: 404 });
	}
	return json({ list });
}

export async function action({ request }: ActionFunctionArgs) {
	await requireUserId(request);
	console.log("SHIIIIT OH NO");

	let formData = await request.formData();
	let subscriberId = formData.get("id");
	if (!subscriberId || typeof subscriberId !== "string") {
		throw json("id is required", { status: 400 });
	}

	console.log("MADE IT");

	let errors = {} as FormFieldErrors;
	let values = {} as FormFieldValues;
	for (let [name, desc] of formFields) {
		errors[name] = null;
		let fieldValue = formData.get(name);
		values[name] = typeof fieldValue === "string" ? fieldValue : null;
		if (desc.required && !fieldValue) {
			errors[name] = `${desc.label} is required`;
		}
	}

	if (hasFormErrors(errors)) {
		return json(
			{
				list: { name: values.name },
				errors,
			},
			{ status: 400 }
		);
	}

	let list = await updateEmailList(subscriberId, {
		name: values.name!,
	});

	return json({ list, errors });
}

export type LoaderData = SerializeFrom<typeof loader>;
export type ActionData = SerializeFrom<typeof action>;

const ROOT_CLASS = "route--subscriber";

export default function UpdateSubscriberPage() {
	let loaderData = useLoaderData<typeof loader>();
	let actionData = useActionData<typeof action>();
	let list = (actionData || loaderData).list;
	let formRef = React.useRef<HTMLFormElement>(null);

	let { errors } = actionData || {};

	React.useEffect(() => {
		let form = formRef.current;
		let errors = actionData?.errors;
		if (!form || !errors || !hasFormErrors(errors)) {
			return;
		}

		let fields = form.elements;
		let firstError = Array.from(fields).find((elem): elem is HTMLElement => {
			let name = elem.getAttribute("name");
			return !!name && errors![name as FormFieldName] != null;
		});

		firstError?.focus();
	}, [actionData]);

	let formKey = React.useMemo(() => JSON.stringify(list), [list]);

	return (
		<div>
			<Form
				key={formKey}
				ref={formRef}
				method="post"
				className={`${ROOT_CLASS}__form`}
			>
				<div className={`${ROOT_CLASS}__title-bar`}>
					<FormField
						id="form-field-name"
						name="name"
						errorMessage={errors?.name}
						defaultValue={list.name}
						label="List Name"
						required
						type="text"
					/>
				</div>
				<input type="hidden" name="id" value={loaderData.list.id} />
				<button type="submit" className="button">
					Save
				</button>
			</Form>
		</div>
	);
}

type FormFieldName = "name";

type InputType = "text" | "email" | "password" | "url" | "number" | "tel";

type FormFieldDescriptor = { required?: boolean; label: string } & {
	type: InputType;
	placeholder?: string;
};

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<Exclude<FormFieldName, "lists">, string | null>;

interface FormFieldProps {
	name: FormFieldName;
	label: string;
	type?: InputType;
	required?: boolean;
	placeholder?: string;
	errorMessage?: string | null;
	rows?: number;
	id: string;
	defaultValue?: string | null;
	min?: string | number;
	max?: string | number;
}

function FormField({
	name,
	type = "text",
	required,
	label,
	id,
	placeholder,
	errorMessage,
	rows,
	defaultValue,
	min,
	max,
}: FormFieldProps) {
	let errorMessageId = `${id}-error`;
	let ariaInvalid = errorMessage ? true : undefined;
	let ariaErrormessage = errorMessage ? errorMessageId : undefined;

	return (
		<div>
			<div>
				<label htmlFor={id}>{label}</label>
				<InputText
					name={name}
					id={id}
					type={type}
					required={required || undefined}
					placeholder={placeholder}
					aria-invalid={ariaInvalid}
					aria-errormessage={ariaErrormessage}
					defaultValue={defaultValue || undefined}
					min={min}
					max={max}
				/>
			</div>
			{errorMessage ? <div id={errorMessageId}>{errorMessage}</div> : null}
		</div>
	);
}

function hasFormErrors(errors: FormFieldErrors) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}
