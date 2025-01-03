import * as React from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { createBlogPost } from "~/models/blog-post.server";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";
import { PostEditorScreen } from "~/features/admin/post-editor-screen";

export async function loader({ request, params }: LoaderFunctionArgs) {
	let currentDate = new Date(
		new Date().toLocaleString("en-US", {
			timeZone: "America/Los_Angeles",
		}),
	);
	return { currentDate };
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

export async function action({ request }: ActionFunctionArgs) {
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
		return data({ errors }, { status: 400 });
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
		<PostEditorScreen
			formRef={formRef}
			defaultValues={{
				createdAt: toDateTimeInputValue(new Date(currentDate)),
			}}
			errors={actionData?.errors}
		/>
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
