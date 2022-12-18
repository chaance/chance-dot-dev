import * as React from "react";
import type { LoaderArgs, ActionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getBlogPost, updateBlogPost } from "~/models/blog-post.server";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";
import invariant from "tiny-invariant";
import { MarkdownEditor, MarkdownEditorTextarea } from "~/ui/markdown-editor";
import { blogContentCache } from "~/lib/blog.server";
import { InputTextarea, InputText } from "~/ui/input";
import { PostEditorScreen } from "../ui/post-editor-screen";

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

export async function loader({ request, params }: LoaderArgs) {
	let { postId } = params;
	invariant(postId, "Post ID is required");
	let userId = await requireUserId(request);
	let post = await getBlogPost(postId, userId);
	if (!post) {
		throw json(null, { status: 404 });
	}
	return json({ post });
}

export async function action({ request }: ActionArgs) {
	// let userId = await requireUserId(request);
	let formData = await request.formData();
	let postId = formData.get("id");
	if (!postId || typeof postId !== "string") {
		throw json("id is required", { status: 400 });
	}

	let errors = {} as FormFieldErrors;
	let values = {} as FormFieldValues;
	for (let [name, desc] of formFields) {
		errors[name] = null;
		let fieldValue = getFormFieldStringValue(formData, name);
		if (desc.required && !fieldValue) {
			errors[name] = `${desc.label} is required`;
		}

		if (desc.type === "datetime-local") {
			let date: Date | null;
			try {
				date = fieldValue ? new Date(fieldValue) : null;
			} catch (err) {
				errors[name] = `${desc.label} is an invalid date`;
				date = null;
			}
			// @ts-expect-error
			values[name] = date;
		} else {
			values[name] = fieldValue;
		}
	}

	if (hasFormErrors(errors)) {
		return json(
			{
				post: {
					...values,
					seo: {
						twitterCard: values.twitterCard,
					},
				},
				errors,
			},
			{ status: 400 }
		);
	}

	let _createdAt = formData.get("_createdAt");
	let createdAt = values.createdAt ? new Date(values.createdAt) : undefined;
	let updatedAt =
		typeof _createdAt === "string" && createdAt !== new Date(_createdAt)
			? createdAt
			: undefined;

	let post = await updateBlogPost(postId, {
		title: values.title!,
		body: values.body!,
		slug: values.slug,
		description: values.description,
		excerpt: values.excerpt,
		createdAt,
		updatedAt,
		seo: {
			twitterCard: values.twitterCard,
		},
	});

	blogContentCache.delete(post.slug);

	// TODO: Clear CDN cache once implemented
	return json({ post, errors });
}

export type LoaderData = SerializeFrom<typeof loader>;
export type ActionData = SerializeFrom<typeof action>;

export default function UpdateNotePage() {
	let loaderData = useLoaderData<typeof loader>();
	let actionData = useActionData<typeof action>();
	let post = (actionData || loaderData).post;
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

	let formKey = React.useMemo(() => JSON.stringify(post), [post]);

	return (
		<div>
			<PostEditorScreen
				formRef={formRef}
				key={formKey}
				getDefaultValue={(name) => {
					if (name === "twitterCard") {
						return post.seo?.twitterCard;
					} else if (name === "createdAt") {
						let val = post[name];
						try {
							val =
								typeof val === "string"
									? toDateTimeInputValue(new Date(val))
									: val;
						} catch (err) {
							val = null;
						}
						return val;
					} else {
						return post[name];
					}
				}}
				errors={actionData?.errors}
				additionalFields={
					<>
						<input type="hidden" name="id" value={loaderData.post.id} />
						<input
							type="hidden"
							name="_createdAt"
							value={loaderData.post.createdAt}
						/>
					</>
				}
				viewPostPath={`/blog/${post.slug}`}
			/>
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

function hasFormErrors(errors: FormFieldErrors) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}

function toDateTimeInputValue(date: Date) {
	let year = String(date.getFullYear());
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let day = String(date.getDate()).padStart(2, "0");
	let hours = String(date.getHours()).padStart(2, "0");
	let minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
