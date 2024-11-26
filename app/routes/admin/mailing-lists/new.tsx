import * as React from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";
import { createEmailList } from "~/models/email-list.server";
import { InputText } from "~/ui/input";

export async function loader({ request, params }: LoaderFunctionArgs) {
	await requireUserId(request);
	return null;
}

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["name", { label: "List Name", required: true, type: "text" }],
]);

export async function action({ request }: ActionFunctionArgs) {
	await requireUserId(request);
	let formData = await request.formData();

	let errors = {} as FormFieldErrors;
	let values = {} as FormFieldValues;
	for (let [name, desc] of formFields) {
		errors[name] = null;
		let fieldValue = getFormFieldStringValue(formData, name);
		if (desc.required && !fieldValue) {
			errors[name] = `${desc.label} is required`;
		}
		values[name] = fieldValue;
	}

	if (hasFormErrors(errors)) {
		return data({ errors, values }, { status: 400 });
	}

	let list = await createEmailList({
		name: values.name!,
	});
	return redirect(`/admin/mailing-lists/${list.id}`);
}

const ROOT_CLASS = "route--new-mailing-list";

export default function NewMailingListPage() {
	let actionData = useActionData<typeof action>();
	let formRef = React.useRef<HTMLFormElement>(null);
	let { errors, values: fieldValues } = actionData || {};
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

	return (
		<div>
			<Form ref={formRef} method="post" className={`${ROOT_CLASS}__form`}>
				<div className={`${ROOT_CLASS}__title-bar`}>
					<FormField
						id="form-field-name"
						name="name"
						errorMessage={errors?.name}
						defaultValue={fieldValues?.name}
						label="List Name"
						required
						type="text"
					/>
				</div>
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
type FormFieldValues = Record<FormFieldName, string | null>;

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
