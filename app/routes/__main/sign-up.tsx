import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { isValidEmail } from "~/lib/utils";
import { Container } from "~/ui/container";
import { Button } from "~/ui/primitives/button";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";
import { Text } from "~/ui/text";

export async function loader({ request }: LoaderArgs) {
	// TODO: Remove after implementing sign up logic
	throw json(null, 404);
}

export async function action({ request }: ActionArgs) {
	let formData = await request.formData();
	let email = formData.get("email");
	let name = formData.get("name");

	let errors: { name: null | string; email: null | string } = {
		name: null,
		email: null,
	};
	let values: { name: null | string; email: null | string } = {
		name: null,
		email: null,
	};

	if (!email) errors.email = "Missing email";
	if (!name) errors.email = "Missing name";
	if (!isValidEmail(email)) {
		errors.email = "Invalid email";
		values.email = typeof email === "string" ? email : null;
	}

	if (typeof name !== "string") {
		errors.name = "Invalid name";
	} else if (/[<>[\]()@#$%^*=!{}\\/]/.test(name)) {
		errors.name =
			"Name cannot contain any of the following characters:\n< > [ ] ( ) @ # $ % ^ * = ! { } \\";
		values.name = name;
	}

	if (errors.email || errors.name) {
		return json({ errors, values }, { status: 400 });
	}

	// TODO: Implement sign up logic

	return redirect(
		`/sign-up?success&name=${encodeURIComponent(
			name as string
		)}&email=${encodeURIComponent(email as string)}`
	);
}

export default function SignUpRoute() {
	let { errors, values } = useActionData<typeof action>() || {};
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
										id="form-field-name"
										name="name"
										errorMessage={errors?.name}
										defaultValue={values?.name || undefined}
										label="Your name"
										required
										type="text"
									/>
									<SignUpFormField
										id="form-field-email"
										name="email"
										errorMessage={errors?.email}
										defaultValue={values?.email || undefined}
										label="Email"
										required
										type="email"
									/>
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
					{success === "true" ? (
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
