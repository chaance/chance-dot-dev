import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createBlogPost } from "~/models/blog-post.server";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["title", { label: "Title", required: true, type: "text" }],
	["slug", { label: "Slug", required: false, type: "text" }],
	["body", { label: "Content", required: true, type: "textarea", rows: 14 }],
	["description", { label: "Description", required: false, type: "text" }],
	["excerpt", { label: "Excerpt", required: false, type: "textarea", rows: 2 }],
	["twitterCard", { label: "Twitter Card URL", required: false, type: "text" }],
]);

export async function action({ request }: ActionArgs) {
	let userId = await requireUserId(request);
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
		return json({ errors }, { status: 400 });
	}

	let post = await createBlogPost({
		title: values.title!,
		slug: values.slug,
		body: values.body!,
		userId,
		description: values.description,
		excerpt: values.excerpt,
		seo: {
			twitterCard: values.twitterCard,
		},
	});
	return redirect(`/admin/blog/${post.id}`);
}

export default function NewNotePage() {
	let actionData = useActionData<typeof action>();
	let formRef = React.useRef<HTMLFormElement>(null);
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
		<Form
			ref={formRef}
			method="post"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 8,
				width: "100%",
			}}
		>
			{Array.from(formFields).map(([name, desc]) => {
				let error = actionData?.errors?.[name];
				return (
					<FormField
						id={`form-field-${name}`}
						key={name}
						name={name}
						errorMessage={error}
						{...desc}
					/>
				);
			})}

			<div>
				<button type="submit" className="button">
					Save
				</button>
			</div>
		</Form>
	);
}

type FormFieldName =
	| "title"
	| "slug"
	| "body"
	| "description"
	| "excerpt"
	| "twitterCard";

type InputType = "text" | "email" | "password" | "url" | "number" | "tel";

type FormFieldDescriptor = { required: boolean; label: string } & (
	| {
			type: InputType;
			placeholder?: string;
	  }
	| {
			type: "textarea";
			placeholder?: string;
			rows: number;
	  }
);

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<FormFieldName, string | null>;

type FormFieldProps = {
	name: FormFieldName;
	label: string;
	type?: InputType | "textarea";
	required?: boolean;
	placeholder?: string;
	errorMessage?: string | null;
	rows?: number;
	id: string;
};

function FormField({
	name,
	type = "text",
	required,
	label,
	id,
	placeholder,
	errorMessage,
	rows,
}: FormFieldProps) {
	let errorMessageId = `${id}-error`;
	let ariaInvalid = errorMessage ? true : undefined;
	let ariaErrormessage = errorMessage ? errorMessageId : undefined;

	return (
		<div>
			<div>
				<label htmlFor={id}>{label}</label>
				{type === "textarea" ? (
					<textarea
						name={name}
						id={id}
						rows={rows}
						required={required || undefined}
						placeholder={placeholder}
						aria-invalid={ariaInvalid}
						aria-errormessage={ariaErrormessage}
					/>
				) : (
					<input
						name={name}
						id={id}
						type={type}
						required={required || undefined}
						placeholder={placeholder}
						aria-invalid={ariaInvalid}
						aria-errormessage={ariaErrormessage}
					/>
				)}
			</div>
			{errorMessage ? <div id={errorMessageId}>{errorMessage}</div> : null}
		</div>
	);
}

function hasFormErrors(errors: FormFieldErrors) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}
