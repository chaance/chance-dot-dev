import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { getFormDataStringValue, isValidEmail } from "~/lib/utils";
import { safeRedirect } from "~/lib/utils.server";
import type { EmailSubscriber } from "~/models/email-list.server";
import { createSubscriber } from "~/models/email-list.server";
import { Container } from "~/ui/container";
import { Button } from "~/ui/primitives/button";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";
import { Text } from "~/ui/text";
import { addSubscriberToForm } from "~/lib/convertkit.server";

// export async function loader({ request }: LoaderArgs) {
// 	// TODO: Remove after implementing sign up logic
// 	throw json(null, 404);
// }

export async function action({ request }: ActionArgs) {
	let formData = await request.formData();
	let fields = {
		email: getFormDataStringValue(formData, "email"),
		nameFirst: getFormDataStringValue(formData, "nameFirst"),
		nameLast: getFormDataStringValue(formData, "nameLast"),
		redirectTo: getFormDataStringValue(formData, "redirectTo"),
		convertKitFormId: getFormDataStringValue(formData, "convertKitFormId"),
	};
	let errors: {
		nameFirst: null | string;
		nameLast: null | string;
		email: null | string;
		convertKitFormId: null | string;
	} = {
		nameFirst: null,
		nameLast: null,
		email: null,
		convertKitFormId: null,
	};

	let honeypot = formData.get("phone");
	if (honeypot) {
		console.log("FAILED HONEYPOT");
		// Send a 200 response so the form doesn't show an error. Bots don't deserve
		// to know they failed.
		return json({
			status: "success" as const,
			values: fields,
			errors,
			formError: null,
		});
	}

	let preventRedirect = formData.get("preventRedirect") === "true";
	console.log({ preventRedirect });

	if (!fields.email) {
		errors.email = "Missing email";
	} else if (!isValidEmail(fields.email)) {
		errors.email = "Invalid email";
	}

	if (!fields.nameFirst) {
		errors.nameFirst = "Missing first name";
	} else if (fields.nameFirst.length > 60) {
		errors.nameFirst = "First name is too long";
	} else if (/[<>[\]()@#$%^*=!{}\\/]/.test(fields.nameFirst)) {
		errors.nameFirst =
			"Name cannot contain any of the following characters:\n< > [ ] ( ) @ # $ % ^ * = ! { } \\";
	}

	if (fields.nameLast != null) {
		if (fields.nameLast.length > 60) {
			errors.nameLast = "Last name is too long";
		} else if (/[<>[\]()@#$%^*=!{}\\/]/.test(fields.nameLast)) {
			errors.nameLast =
				"Name cannot contain any of the following characters:\n< > [ ] ( ) @ # $ % ^ * = ! { } \\";
		}
	}

	if (!fields.convertKitFormId) {
		errors.convertKitFormId = "Missing ConvertKit form ID";
	}

	if (errors.email || errors.nameFirst || errors.nameLast) {
		return json(
			{
				errors,
				values: fields,
				formError: null,
				status: "field-errors" as const,
			},
			{ status: 400 }
		);
	}

	// let subscriber: EmailSubscriber;
	// try {
	// 	subscriber = await createSubscriber({
	// 		email: fields.email!,
	// 		nameFirst: fields.nameFirst!,
	// 		nameLast: fields.nameLast,
	// 	});
	// } catch (error) {
	// 	return json(
	// 		{
	// 			values: fields,
	// 			errors,
	// 			formError:
	// 				"There was an error subscribing to the newsletter. Please try again later.",
	// 		},
	// 		{ status: 500 }
	// 	);
	// }

	try {
		await addSubscriberToForm({
			convertKitFormId: fields.convertKitFormId!,
			email: fields.email!,
			nameFirst: fields.nameFirst!,
			nameLast: fields.nameLast,
		});
	} catch (error: unknown) {
		return json(
			{
				values: fields,
				errors,
				formError:
					"There was an error subscribing to the newsletter. Please try again later.",
				status: "error" as const,
			},
			{ status: 500 }
		);
	}

	if (preventRedirect) {
		return json({
			// subscriber,
			values: fields,
			errors,
			formError: null,
			status: "success" as const,
		});
	}

	let params = new URLSearchParams();
	params.set("success", "true");
	params.set("nameFirst", fields.nameFirst!);
	fields.nameLast && params.set("nameLast", fields.nameLast);
	params.set("email", fields.email!);
	let search = "?" + params.toString();
	let defaultRedirectUrl = `/sign-up${search}`;
	return safeRedirect(formData.get("redirectTo"), defaultRedirectUrl);
}

export default function SignUpRoute() {
	let { errors, values, formError } = useActionData<typeof action>() || {};
	let [params] = useSearchParams();
	let success = params.get("success");

	return (
		<div>
			<Container>
				<div style={{ maxWidth: "28rem", margin: "0 auto" }}>
					<div>
						<div className="prose prose-tight" style={{ marginBottom: "2rem" }}>
							<Text as="Heading" variant="heading-1">
								Sign Up for Updates
							</Text>
							<Text variant="body">
								I send out infrequent emails—trust me, I hate spam too—with
								updates about Remix, my course Front to Back, events, and other
								goodies from my software journey.
							</Text>
						</div>
						<SignUpForm
							fields={
								<>
									<SignUpFormField
										id="form-field-email"
										name="email"
										errorMessage={errors?.email}
										defaultValue={values?.email || undefined}
										label="Email"
										required
										type="email"
									/>
									<SignUpFormField
										id="form-field-name-first"
										name="nameFirst"
										errorMessage={errors?.nameFirst}
										defaultValue={values?.nameFirst || undefined}
										label="First name"
										type="text"
									/>
									<SignUpFormField
										id="form-field-name-last"
										name="nameLast"
										errorMessage={errors?.nameLast}
										defaultValue={values?.nameLast || undefined}
										label="Last name"
										type="text"
									/>
									<div className="sr-only">
										<label htmlFor="form-field-phone">Phone number</label>
										<span id="phone-desc">
											Screen-reader users: do not complete this field or the
											form submission will fail.
										</span>
										<input
											id="form-field-phone"
											aria-describedby="phone-desc"
											type="text"
											name="phone"
										/>
									</div>
								</>
							}
							submitButton={
								<Button
									type="submit"
									className="button button-primary button-block"
								>
									Sign Up
								</Button>
							}
						/>
					</div>
					{formError ? (
						<div
							style={{
								marginTop: "1rem",
							}}
						>
							<Text color="critical">{formError}</Text>
						</div>
					) : success === "true" ? (
						<div
							style={{
								marginTop: "1rem",
							}}
						>
							<Text color="success">
								Thanks for signing up! Check your email to confirm your
								subscription.
							</Text>
						</div>
					) : null}
				</div>
			</Container>
		</div>
	);
}
