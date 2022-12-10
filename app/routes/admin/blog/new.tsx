import * as React from "react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createBlogPost } from "~/models/blog-post.server";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";
import { MarkdownEditor, MarkdownEditorTextarea } from "~/ui/markdown-editor";

export function links() {
	return [
		{
			rel: "stylesheet",
			href: "https://unpkg.com/easymde/dist/easymde.min.css",
		},
	];
}

export async function loader({ request, params }: LoaderArgs) {
	let currentDate = new Date(
		new Date().toLocaleString("en-US", {
			timeZone: "America/Los_Angeles",
		})
	);
	console.log(currentDate);
	return json({ currentDate });
}

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["title", { label: "Title", required: true, type: "text" }],
	["slug", { label: "Slug", required: false, type: "text" }],
	[
		"createdAt",
		{ label: "Created At", required: false, type: "datetime-local" },
	],
	["body", { label: "Content", required: true, type: "markdown", rows: 14 }],
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

	let createdAt = values.createdAt ? new Date(values.createdAt) : undefined;
	let updatedAt = createdAt;

	let post = await createBlogPost({
		title: values.title!,
		slug: values.slug,
		body: values.body!,
		userId,
		description: values.description,
		excerpt: values.excerpt,
		createdAt,
		updatedAt,
		seo: {
			twitterCard: values.twitterCard,
		},
	});
	return redirect(`/admin/blog/${post.id}`);
}

export default function NewNotePage() {
	let { currentDate } = useLoaderData<typeof loader>();
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

				let defaultValue: string | undefined = undefined;
				if (desc.type === "datetime-local") {
					defaultValue = toDateTimeInputValue(new Date(currentDate));
				}

				return (
					<FormField
						id={`form-field-${name}`}
						key={name}
						name={name}
						errorMessage={error}
						defaultValue={defaultValue}
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
	| "createdAt"
	| "twitterCard";

type InputType = "text" | "email" | "password" | "url" | "number" | "tel";

type FormFieldDescriptor = { required: boolean; label: string } & (
	| {
			type: InputType;
			placeholder?: string;
	  }
	| {
			type: "datetime-local";
	  }
	| {
			type: "textarea";
			placeholder?: string;
			rows: number;
	  }
	| {
			type: "markdown";
			placeholder?: string;
			rows: number;
	  }
);

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<FormFieldName, string | null>;

interface FormFieldProps {
	name: FormFieldName;
	label: string;
	type?: InputType | "textarea" | "markdown" | "datetime-local";
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

	let mdOpts = React.useMemo(() => {
		return {
			forceSync: true,
			maxHeight: "500px",
		};
	}, []);

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
						defaultValue={defaultValue || undefined}
					/>
				) : type === "markdown" ? (
					<MarkdownEditor
						fieldId={id}
						options={mdOpts}
						defaultValue={defaultValue || undefined}
					>
						<MarkdownEditorTextarea
							name={name}
							rows={rows}
							required={required || undefined}
							placeholder={placeholder}
							aria-invalid={ariaInvalid}
							aria-errormessage={ariaErrormessage}
						/>
					</MarkdownEditor>
				) : (
					<input
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

function toDateTimeInputValue(date: Date) {
	let year = String(date.getFullYear());
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let day = String(date.getDay()).padStart(2, "0");
	let hours = String(date.getHours()).padStart(2, "0");
	let minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
