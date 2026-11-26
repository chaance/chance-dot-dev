import * as React from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { Form, useActionData } from "react-router";
import { requireUserId } from "~/lib/session.server";
import { getFormFieldStringValue } from "~/lib/utils";
import { createSubscriber } from "~/models/email-list.server";
import {
	AdminEditLayout,
	AdminPageHeader,
	AdminPostbox,
	AdminTextField,
} from "~/features/admin/admin-ui";

export async function loader({ request, params }: LoaderFunctionArgs) {
	await requireUserId(request);
	return null;
}

const formFields = new Map<FormFieldName, FormFieldDescriptor>([
	["email", { label: "Email", required: true, type: "email" }],
	["nameFirst", { label: "First Name", type: "text" }],
	["nameLast", { label: "Last Name", type: "text" }],
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

	let subscriber = await createSubscriber({
		email: values.email!,
		nameFirst: values.nameFirst,
		nameLast: values.nameLast,
	});
	return redirect(`/admin/subscribers/${subscriber.id}`);
}

export default function NewSubscriberPage() {
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
			<AdminPageHeader title="Add New Subscriber" />
			<Form ref={formRef} method="post">
				<AdminEditLayout
					main={
						<AdminPostbox title="Details">
							<AdminTextField
								id="form-field-email"
								name="email"
								errorMessage={errors?.email}
								defaultValue={fieldValues?.email}
								label="Email"
								required
								type="email"
							/>
							<AdminTextField
								id="form-field-name-first"
								name="nameFirst"
								errorMessage={errors?.nameFirst}
								defaultValue={fieldValues?.nameFirst}
								label="First Name"
							/>
							<AdminTextField
								id="form-field-name-last"
								name="nameLast"
								errorMessage={errors?.nameLast}
								defaultValue={fieldValues?.nameLast}
								label="Last Name"
							/>
						</AdminPostbox>
					}
					sidebar={
						<AdminPostbox
							title="Save"
							footer={
								<button
									type="submit"
									className="AdminButton AdminButton--primary"
								>
									Add Subscriber
								</button>
							}
						/>
					}
				/>
			</Form>
		</div>
	);
}

type FormFieldName = "email" | "nameFirst" | "nameLast" | "lists";

type InputType = "text" | "email" | "password" | "url" | "number" | "tel";

type FormFieldDescriptor = { required?: boolean; label: string } & {
	type: InputType;
	placeholder?: string;
};

type FormFieldErrors = Record<FormFieldName, string | null>;
type FormFieldValues = Record<FormFieldName, string | null>;

function hasFormErrors(errors: FormFieldErrors) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}
