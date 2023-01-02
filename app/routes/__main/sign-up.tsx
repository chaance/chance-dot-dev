import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { isValidEmail } from "~/lib/utils";
import { safeRedirect } from "~/lib/utils.server";
import type { EmailSubscriber } from "~/models/email-list.server";
import { createSubscriber } from "~/models/email-list.server";
import { Container } from "~/ui/container";
import { Button } from "~/ui/primitives/button";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";
import { Text } from "~/ui/text";

// export async function loader({ request }: LoaderArgs) {
// 	// TODO: Remove after implementing sign up logic
// 	throw json(null, 404);
// }

export async function action({ request }: ActionArgs) {
	let formData = await request.formData();
	let honeypot = formData.get("phone");
	let email = formData.get("email");
	let nameFirst = formData.get("nameFirst");
	let nameLast = formData.get("nameLast");
	let redirectTo = formData.get("redirectTo");
	let preventRedirect = formData.get("preventRedirect") === "true";
	if (honeypot) {
		return json(null, 400);
	}

	let errors: {
		nameFirst: null | string;
		nameLast: null | string;
		email: null | string;
	} = {
		nameFirst: null,
		nameLast: null,
		email: null,
	};
	let values: typeof errors = {
		nameFirst: null,
		nameLast: null,
		email: null,
	};

	if (!email) errors.email = "Missing email";
	if (!isValidEmail(email)) {
		errors.email = "Invalid email";
		values.email = typeof email === "string" ? email : null;
	}

	if (nameFirst != null) {
		if (typeof nameFirst !== "string") {
			errors.nameFirst = "Invalid first name";
		} else if (/[<>[\]()@#$%^*=!{}\\/]/.test(nameFirst)) {
			errors.nameFirst =
				"Name cannot contain any of the following characters:\n< > [ ] ( ) @ # $ % ^ * = ! { } \\";
			values.nameFirst = nameFirst;
		}
	}
	if (nameLast != null) {
		if (typeof nameLast !== "string") {
			errors.nameLast = "Invalid last name";
		} else if (/[<>[\]()@#$%^*=!{}\\/]/.test(nameLast)) {
			errors.nameLast =
				"Name cannot contain any of the following characters:\n< > [ ] ( ) @ # $ % ^ * = ! { } \\";
			values.nameLast = nameLast;
		}
	}

	if (errors.email || errors.nameFirst || errors.nameLast) {
		return json({ errors, values, formError: null }, { status: 400 });
	}

	let subscriber: EmailSubscriber;
	try {
		subscriber = await createSubscriber({
			email: email as string,
			nameFirst: nameFirst as string,
			nameLast: nameLast as string,
		});
	} catch (error) {
		return json(
			{
				values,
				errors,
				formError:
					"There was an error subscribing to the newsletter. Please try again later.",
			},
			{ status: 500 }
		);
	}

	if (preventRedirect) {
		return json({
			subscriber,
			values,
			errors,
			formError: null,
		});
	}

	let params = new URLSearchParams();
	params.set("success", "true");
	subscriber.nameFirst && params.set("nameFirst", subscriber.nameFirst);
	subscriber.nameLast && params.set("nameLast", subscriber.nameLast);
	params.set("email", subscriber.email);
	let search = "?" + params.toString();
	let defaultRedirectUrl = `/sign-up${search}`;
	return safeRedirect(redirectTo || defaultRedirectUrl, defaultRedirectUrl);
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
