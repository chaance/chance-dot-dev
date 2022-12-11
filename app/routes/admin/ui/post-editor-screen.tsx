import * as React from "react";
import { Form } from "@remix-run/react";
import { MarkdownEditor, MarkdownEditorTextarea } from "~/ui/markdown-editor";
import { InputTextarea, InputText } from "~/ui/input";

const ROOT_CLASS = "cs--post-editor-screen";

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
	[
		"twitterCard",
		{
			label: "Twitter Card URL",
			required: false,
			type: "text",
		},
	],
]);

export function PostEditorScreen({
	formKey,
	formRef,
	formAction,
	errors,
	defaultValues,
	getDefaultValue,
	additionalFields,
}: {
	formKey?: string;
	formRef: React.Ref<HTMLFormElement>;
	formAction?: string;
	errors: Partial<FormFieldErrors> | undefined | null;
	defaultValues?: Partial<FormFieldValues>;
	getDefaultValue?(name: FormFieldName): string | undefined | null;
	additionalFields?: React.ReactNode;
}) {
	return (
		<div className={ROOT_CLASS}>
			<Form
				key={formKey}
				ref={formRef}
				action={formAction}
				method="post"
				className={`${ROOT_CLASS}__form`}
			>
				<div className={`${ROOT_CLASS}__title-bar`}>
					<FormField
						id="form-field-title"
						name="title"
						errorMessage={errors?.title}
						defaultValue={defaultValues?.title || getDefaultValue?.("title")}
						label="Title"
						required
						type="text"
					/>
					<FormField
						id="form-field-slug"
						name="slug"
						errorMessage={errors?.slug}
						defaultValue={defaultValues?.slug || getDefaultValue?.("slug")}
						label="Slug"
						type="text"
					/>
				</div>
				<div className={`${ROOT_CLASS}__main-content`}>
					{Array.from(formFields).map(([name, desc]) => {
						if (name === "title" || name === "slug" || name === "createdAt")
							return null;

						let error = errors?.[name];
						let defaultValue = defaultValues?.[name] || getDefaultValue?.(name);
						// name === "twitterCard" ? post.seo?.twitterCard : post[name];

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
				</div>
				<div className={`${ROOT_CLASS}__sidebar`}>
					<div className={`${ROOT_CLASS}__sidebar-content`}>
						<FormField
							id="form-field-createdAt"
							name="createdAt"
							errorMessage={errors?.createdAt}
							defaultValue={
								defaultValues?.createdAt || getDefaultValue?.("createdAt")
							}
							label="Created At"
							type="datetime-local"
						/>
						<div>
							<button type="submit" className="button">
								Save
							</button>
						</div>
					</div>
				</div>

				{/* <input type="hidden" name="id" value={postId} /> */}
				{/* <input
				type="hidden"
				name="_createdAt"
				value={loaderData.post.createdAt}
			/> */}

				{additionalFields}
			</Form>
		</div>
	);
}

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
					<InputTextarea
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
				)}
			</div>
			{errorMessage ? <div id={errorMessageId}>{errorMessage}</div> : null}
		</div>
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
	| { type: InputType; placeholder?: string }
	| { type: "datetime-local" }
	| { type: "textarea"; placeholder?: string; rows: number }
	| { type: "markdown"; placeholder?: string; rows: number }
);

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<FormFieldName, string | null>;
