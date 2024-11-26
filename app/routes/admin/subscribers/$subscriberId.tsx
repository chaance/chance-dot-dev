import * as assert from "node:assert";
import * as React from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/lib/session.server";
import { InputText, InputCheckbox } from "~/ui/input";
import { Card } from "~/ui/card";
import {
	getAllEmailLists,
	getSubscriber,
	updateSubscriber,
} from "~/models/email-list.server";

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["email", { label: "Email", required: true, type: "email" }],
	["nameFirst", { label: "First Name", type: "text" }],
	["nameLast", { label: "Last Name", type: "text" }],
	[
		"lists",
		{
			label: "Mailing Lists",
			type: "checkbox-group",
		},
	],
]);

export async function loader({ request, params }: LoaderFunctionArgs) {
	let { subscriberId } = params;
	assert.ok(subscriberId, "Subscriber ID is required");
	await requireUserId(request);
	let [allLists, subscriber] = await Promise.all([
		getAllEmailLists(),
		getSubscriber(subscriberId, { lists: true }),
	]);
	if (!subscriber) {
		throw data(null, { status: 404 });
	}
	return {
		subscriber: {
			...subscriber,
			lists: subscriber.lists.map((list) => list.id),
		},
		allLists,
	};
}

export async function action({ request }: ActionFunctionArgs) {
	await requireUserId(request);

	let formData = await request.formData();
	let subscriberId = formData.get("id");
	if (!subscriberId || typeof subscriberId !== "string") {
		throw data("id is required", { status: 400 });
	}

	let errors = {} as FormFieldErrors;
	let values = {} as FormFieldValues;
	for (let [name, desc] of formFields) {
		errors[name] = null;
		if (name === "lists") {
			let lists = formData.getAll("lists");
			values[name] = lists.filter((v): v is string => typeof v === "string");
		} else {
			let fieldValue = formData.get(name);
			values[name] = typeof fieldValue === "string" ? fieldValue : null;
			if (desc.required && !fieldValue) {
				errors[name] = `${desc.label} is required`;
			}
		}
	}

	if (hasFormErrors(errors)) {
		return data(
			{
				subscriber: {
					email: values.email,
					nameFirst: values.nameFirst,
					nameLast: values.nameLast,
					lists: values.lists,
				},
				errors,
			},
			{ status: 400 },
		);
	}

	let subscriber = await updateSubscriber(subscriberId, {
		email: values.email!,
		nameFirst: values.nameFirst,
		nameLast: values.nameLast,
		lists: values.lists || [],
	});

	return {
		subscriber: {
			...subscriber,
			lists: subscriber.lists.map((list) => list.id),
		},
		errors,
	};
}

const ROOT_CLASS = "route--subscriber";

export default function UpdateSubscriberPage() {
	let loaderData = useLoaderData<typeof loader>();
	let actionData = useActionData<typeof action>();
	let subscriber = (actionData || loaderData).subscriber;
	let allLists = loaderData.allLists;
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

	let formKey = React.useMemo(() => JSON.stringify(subscriber), [subscriber]);

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
						id="form-field-email"
						name="email"
						errorMessage={errors?.email}
						defaultValue={subscriber.email}
						label="Email"
						required
						type="email"
					/>
				</div>
				<div className={`${ROOT_CLASS}__main-content`}>
					<Card removePadding="sm-down" removeBackground="sm-down">
						<FormField
							id="form-field-name-first"
							name="nameFirst"
							errorMessage={errors?.nameFirst}
							defaultValue={subscriber.nameFirst}
							label="First Name"
							type="text"
						/>
						<FormField
							id="form-field-name-last"
							name="nameLast"
							errorMessage={errors?.nameLast}
							defaultValue={subscriber.nameLast}
							label="Last Name"
							type="text"
						/>
						{/* LISTS */}
						<div>
							<div
								role="group"
								aria-labelledby="form-field-lists-group-label"
								aria-describedby={
									errors?.lists ? "form-field-lists-error" : undefined
								}
							>
								<div>
									<div id="form-field-lists">Lists</div>
									{errors?.lists ? (
										<div id="form-field-lists-error">{errors.lists}</div>
									) : null}
								</div>
								<div>
									{allLists.map((list) => {
										let isSubscribed = !!subscriber.lists.find(
											(l) => l === list.id,
										);
										return (
											<div key={list.id}>
												<InputCheckbox
													name="lists"
													value={list.id}
													id={`form-field-lists-opt-${list.id}`}
													defaultChecked={isSubscribed}
												/>
												<label htmlFor={`form-field-lists-opt-${list.id}`}>
													{list.name}
												</label>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</Card>
				</div>
				<input type="hidden" name="id" value={loaderData.subscriber.id} />
				<button type="submit" className="button">
					Save
				</button>
			</Form>
		</div>
	);
}

type FormFieldName = "email" | "nameFirst" | "nameLast" | "lists";

type InputType = "text" | "email" | "password" | "url" | "number" | "tel";

type FormFieldDescriptor = { required?: boolean; label: string } & (
	| {
			type: InputType;
			placeholder?: string;
	  }
	| {
			type: "checkbox-group";
			// inputs: { label: string; value: string }[];
	  }
);

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<Exclude<FormFieldName, "lists">, string | null> &
	Record<"lists", string[]>;

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
