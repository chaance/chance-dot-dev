import * as React from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { Form, Link, useActionData, useLoaderData } from "react-router";
import { requireUserId } from "~/lib/session.server";
import { getEmailList, updateEmailList } from "~/models/email-list.server";
import * as assert from "node:assert";
import {
	AdminEditLayout,
	AdminPageHeader,
	AdminPostbox,
	AdminTextField,
} from "~/features/admin/admin-ui";
import { formatAdminDate } from "~/features/admin/admin-utils";

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["name", { label: "List Name", required: true, type: "text" }],
]);

export async function loader({ request, params }: LoaderFunctionArgs) {
	let { listId } = params;
	assert.ok(listId, "List ID is required");
	await requireUserId(request);
	let list = await getEmailList(listId, { subscribers: true });
	if (!list) {
		throw data(null, { status: 404 });
	}
	return { list };
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
		let fieldValue = formData.get(name);
		values[name] = typeof fieldValue === "string" ? fieldValue : null;
		if (desc.required && !fieldValue) {
			errors[name] = `${desc.label} is required`;
		}
	}

	if (hasFormErrors(errors)) {
		return data(
			{
				list: { name: values.name },
				errors,
			},
			{ status: 400 },
		);
	}

	let list = await updateEmailList(subscriberId, {
		name: values.name!,
	});

	return { list, errors };
}

export default function UpdateSubscriberPage() {
	let loaderData = useLoaderData<typeof loader>();
	let actionData = useActionData<typeof action>();
	let list = (actionData || loaderData).list;
	let subscribers = loaderData.list.subscribers;
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
			<AdminPageHeader
				title="Edit Mailing List"
				action={{ to: "/admin/mailing-lists/new", label: "Add New List" }}
			/>
			<Form key={formKey} ref={formRef} method="post">
				<input type="hidden" name="id" value={loaderData.list.id} />
				<AdminEditLayout
					main={
						<>
							<AdminPostbox title="Details">
								<AdminTextField
									id="form-field-name"
									name="name"
									errorMessage={errors?.name}
									defaultValue={list.name}
									label="List Name"
									required
								/>
							</AdminPostbox>
							<AdminPostbox title="Subscribers">
								{subscribers.length < 1 ? (
									<p>No one has subscribed to this list yet.</p>
								) : (
									<ul className="AdminSimpleList">
										{subscribers.map((subscriber) => (
											<li key={subscriber.id}>
												<Link
													to={`/admin/subscribers/${subscriber.id}`}
													className="AdminTable__primary-link"
												>
													{subscriber.email}
												</Link>
											</li>
										))}
									</ul>
								)}
							</AdminPostbox>
						</>
					}
					sidebar={
						<AdminPostbox
							title="Save"
							footer={
								<button
									type="submit"
									className="AdminButton AdminButton--primary"
								>
									Update List
								</button>
							}
						>
							<p>
								Created on{" "}
								<strong>{formatAdminDate(loaderData.list.createdAt)}</strong>
							</p>
							<p>
								<strong>{subscribers.length}</strong>{" "}
								{subscribers.length === 1 ? "subscriber" : "subscribers"}
							</p>
						</AdminPostbox>
					}
				/>
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

function hasFormErrors(errors: FormFieldErrors) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}
