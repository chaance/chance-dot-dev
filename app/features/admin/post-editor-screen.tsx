import * as React from "react";
import { Form, Link } from "react-router";
import { InputTextarea, InputText } from "~/ui/input";
import { Card } from "~/ui/card";
import { slugify } from "~/lib/utils";
import {
	MarkdownEditor,
	MarkdownEditorTextarea,
} from "~/features/admin/markdown-editor.js";

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
	viewPostPath,
}: {
	formKey?: string;
	formRef: React.Ref<HTMLFormElement>;
	formAction?: string;
	errors: Partial<FormFieldErrors> | undefined | null;
	defaultValues?: Partial<FormFieldValues>;
	getDefaultValue?(name: FormFieldName): string | undefined | null;
	additionalFields?: React.ReactNode;
	viewPostPath?: string;
}) {
	let [editingSlug, setEditingSlug] = React.useState(false);
	let [slugValue, setSlugValue] = React.useState(
		defaultValues?.slug || getDefaultValue?.("slug") || "",
	);

	let slugFieldRef = React.useRef<HTMLInputElement>(null);
	let slugEditButtonRef = React.useRef<HTMLButtonElement>(null);
	let prevEditingSlug = React.useRef<boolean>(false);
	React.useEffect(() => {
		if (prevEditingSlug.current !== editingSlug) {
			if (editingSlug) {
				slugFieldRef.current?.focus();
			} else {
				slugEditButtonRef.current?.focus();
			}
		}
		prevEditingSlug.current = editingSlug;
	}, [editingSlug]);

	let slugValueRef = React.useRef(slugValue);
	React.useEffect(() => {
		slugValueRef.current = slugValue;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editingSlug]);

	function handleSlugEditComplete(value: string) {
		if (!value) {
			setSlugValue(slugify(slugValueRef.current));
		} else {
			setSlugValue(slugify(value));
		}
		setEditingSlug(false);
	}

	return (
		<div className="PostEditorScreen">
			<Form
				key={formKey}
				ref={formRef}
				action={formAction}
				method="post"
				className="PostEditorScreen__form"
			>
				<div className="PostEditorScreen__title-bar">
					<FormField
						id="form-field-title"
						name="title"
						errorMessage={errors?.title}
						defaultValue={defaultValues?.title || getDefaultValue?.("title")}
						label="Title"
						required
						type="text"
						onBlur={(evt) => {
							let value = evt.target.value.trim();
							if (value && !slugValue) {
								setSlugValue(slugify(value));
							}
						}}
					/>
					<div className="PostEditorScreen__slug-wrapper">
						{editingSlug ? (
							<>
								<label
									htmlFor="form-field-slug"
									className="PostEditorScreen__slug-label"
								>
									Slug:
								</label>{" "}
								<div className="PostEditorScreen__slug-input-wrapper">
									<span className="PostEditorScreen__slug-input-prefix">/</span>
									<input
										id="form-field-slug"
										ref={slugFieldRef}
										type="text"
										value={slugValue}
										className="PostEditorScreen__slug-input"
										onChange={(evt) => {
											setSlugValue(evt.target.value);
										}}
										onKeyDown={(evt) => {
											if (evt.key === "Enter") {
												evt.preventDefault();
												let value = evt.currentTarget.value;
												handleSlugEditComplete(value);
											} else if (evt.key === "Escape") {
												evt.preventDefault();
												handleSlugEditComplete(slugValueRef.current);
											}
										}}
										onFocus={(evt) => {
											evt.currentTarget.select();
										}}
										onBlur={(evt) => {
											let value = evt.target.value;
											handleSlugEditComplete(value);
										}}
									/>
								</div>
								<input
									type="hidden"
									name="slug"
									value={slugValue ? slugify(slugValue) : undefined}
								/>
							</>
						) : (
							<>
								<span className="PostEditorScreen__slug-label">Slug:</span>{" "}
								<span className="PostEditorScreen__slug-output">{`/${slugValue}`}</span>{" "}
								<button
									ref={slugEditButtonRef}
									type="button"
									className="PostEditorScreen__slug-edit-button"
									onClick={(evt) => {
										setEditingSlug(true);
									}}
								>
									Edit<span className="sr-only"> Slug</span>
								</button>
								<input type="hidden" name="slug" value={slugValue} />
							</>
						)}
					</div>
				</div>
				<div className="PostEditorScreen__main-content">
					<Card removePadding="sm-down" removeBackground="sm-down">
						{Array.from(formFields).map(([name, desc]) => {
							if (name === "title" || name === "slug" || name === "createdAt")
								return null;

							let error = errors?.[name];
							let defaultValue =
								defaultValues?.[name] || getDefaultValue?.(name);
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
					</Card>
				</div>
				<div className="PostEditorScreen__sidebar">
					<div className="PostEditorScreen__sidebar-content">
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
						<div className="PostEditorScreen__sidebar-buttons">
							<button type="submit" className="button">
								Save
							</button>
							{viewPostPath ? (
								<Link to={viewPostPath} className="button">
									View Post
								</Link>
							) : null}
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
	onChange?(
		evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	): void;
	onBlur?(evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
	onFocus?(evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
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
	onChange,
	onBlur,
	onFocus,
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
						onChange={onChange}
						onBlur={onBlur}
						onFocus={onFocus}
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
							onChange={onChange}
							onBlur={onBlur}
							onFocus={onFocus}
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
						onChange={onChange}
						onBlur={onBlur}
						onFocus={onFocus}
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
