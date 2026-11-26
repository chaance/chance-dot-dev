import * as React from "react";
import { Form, Link } from "react-router";
import { InputTextarea, InputText } from "~/ui/input";
import {
	AdminEditLayout,
	AdminField,
	AdminPageHeader,
	AdminPostbox,
} from "~/features/admin/admin-ui";
import { getErrorMessageId } from "~/features/admin/admin-utils";
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
	mode,
	formKey,
	formRef,
	formAction,
	errors,
	defaultValues,
	getDefaultValue,
	additionalFields,
	viewPostPath,
}: {
	mode: "new" | "edit";
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

	function renderField(
		name: Exclude<FormFieldName, "title" | "slug">,
		props?: Partial<FormFieldProps>,
	) {
		let desc = formFields.get(name)!;
		return (
			<FormField
				id={`form-field-${name}`}
				name={name}
				errorMessage={errors?.[name]}
				defaultValue={defaultValues?.[name] || getDefaultValue?.(name)}
				{...desc}
				{...props}
			/>
		);
	}

	let isNew = mode === "new";

	return (
		<div className="PostEditorScreen">
			<AdminPageHeader
				title={isNew ? "Add New Post" : "Edit Post"}
				action={
					isNew ? undefined : { to: "/admin/blog/new", label: "Add New Post" }
				}
			/>
			<Form
				key={formKey}
				ref={formRef}
				action={formAction}
				method="post"
				className="PostEditorScreen__form"
			>
				<AdminEditLayout
					main={
						<>
							<div className="PostEditorScreen__title-bar">
								<FormField
									id="form-field-title"
									name="title"
									errorMessage={errors?.title}
									defaultValue={
										defaultValues?.title || getDefaultValue?.("title")
									}
									label="Title"
									hideLabel
									placeholder="Add title"
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
												Permalink:
											</label>
											<div className="PostEditorScreen__slug-input-wrapper">
												<span className="PostEditorScreen__slug-input-prefix">
													/blog/
												</span>
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
											<span className="PostEditorScreen__slug-label">
												Permalink:
											</span>
											<span className="PostEditorScreen__slug-output">
												{`/blog/${slugValue}`}
											</span>
											<button
												ref={slugEditButtonRef}
												type="button"
												className="AdminButton AdminButton--small PostEditorScreen__slug-edit-button"
												onClick={() => {
													setEditingSlug(true);
												}}
											>
												Edit<span className="sr-only"> permalink</span>
											</button>
											<input type="hidden" name="slug" value={slugValue} />
										</>
									)}
								</div>
							</div>

							{renderField("body", { hideLabel: true })}

							<AdminPostbox title="Excerpt">
								{renderField("excerpt", { hideLabel: true })}
							</AdminPostbox>

							<AdminPostbox title="SEO">
								{renderField("description")}
								{renderField("twitterCard")}
							</AdminPostbox>
						</>
					}
					sidebar={
						<AdminPostbox
							title="Publish"
							footer={
								<>
									{viewPostPath ? (
										<Link
											to={viewPostPath}
											className="AdminButton AdminButton--small"
										>
											View Post
										</Link>
									) : null}
									<button
										type="submit"
										className="AdminButton AdminButton--primary"
									>
										{isNew ? "Publish" : "Update"}
									</button>
								</>
							}
						>
							{renderField("createdAt", { label: "Publish date" })}
						</AdminPostbox>
					}
				/>

				{additionalFields}
			</Form>
		</div>
	);
}

interface FormFieldProps {
	name: FormFieldName;
	label: string;
	hideLabel?: boolean;
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
	hideLabel,
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
	let errorMessageId = getErrorMessageId(id);
	let ariaInvalid = errorMessage ? true : undefined;
	let ariaErrormessage = errorMessage ? errorMessageId : undefined;

	let mdOpts = React.useMemo(() => {
		return {
			forceSync: true,
			maxHeight: "500px",
		};
	}, []);

	return (
		<AdminField
			id={id}
			label={label}
			hideLabel={hideLabel}
			required={required}
			errorMessage={errorMessage}
		>
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
		</AdminField>
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
