import * as React from "react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createUserSession, getSessionUser } from "~/lib/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import {
	getPasswordErrorMessage,
	isValidEmail,
	validatePassword,
} from "~/lib/utils";
import { getSafeRedirect } from "~/lib/utils.server";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { InputText } from "~/ui/input";

export async function loader({ request }: LoaderArgs) {
	let user = await getSessionUser(request);
	if (user) {
		return redirect("/admin");
	}
	return json(null);
}

export async function action({ request }: ActionArgs) {
	let formData = await request.formData();
	let email = formData.get("email");
	let password = formData.get("password");
	let passwordConfirm = formData.get("passwordConfirm");
	let redirectTo = getSafeRedirect(formData.get("redirectTo"), "/admin");

	// disallow sign-ups for now
	if (email !== process.env.AUTHENTICATED_EMAIL) {
		return json(
			{
				errors: {
					email: "This email is not allowed to register",
					password: null,
					passwordConfirm: null,
				},
			},
			{ status: 400 }
		);
	}

	if (!isValidEmail(email)) {
		return json(
			{
				errors: {
					email: "Email is invalid",
					password: null,
					passwordConfirm: null,
				},
			},
			{ status: 400 }
		);
	}

	if (typeof password !== "string" || password.length === 0) {
		return json(
			{
				errors: {
					email: null,
					password: "Password is required",
					passwordConfirm: null,
				},
			},
			{ status: 400 }
		);
	}

	if (typeof passwordConfirm !== "string" || passwordConfirm.length === 0) {
		return json(
			{
				errors: {
					email: null,
					password: null,
					passwordConfirm: "Password confirmation is required",
				},
			},
			{ status: 400 }
		);
	}

	if (passwordConfirm !== password) {
		return json(
			{
				errors: {
					email: null,
					password: null,
					passwordConfirm: "Passwords do not match",
				},
			},
			{ status: 400 }
		);
	}

	let errors = validatePassword(password);
	if (errors.length > 0) {
		return json(
			{
				errors: {
					email: null,
					password: getPasswordErrorMessage(errors[0]),
					passwordConfirm: null,
				},
			},
			{ status: 400 }
		);
	}

	// TODO: check prisma error message and see if we can get this without two
	// queries
	let existingUser = await getUserByEmail(email);
	if (existingUser) {
		return json(
			{
				errors: {
					email: "A user already exists with this email",
					password: null,
					passwordConfirm: null,
				},
			},
			{ status: 400 }
		);
	}

	try {
		let user = await createUser(email, password, {
			nameLast: null,
			nameFirst: null,
			avatarUrl: null,
		});
		return createUserSession({
			request,
			userId: user.id,
			remember: false,
			redirectTo,
		});
	} catch (err) {
		return json(
			{
				errors: {
					email: "An error occurred. Please try again later.",
					password: null,
					passwordConfirm: null,
				},
			},
			{ status: 500 }
		);
	}
}

export const meta: MetaFunction = () => {
	return {
		title: "Sign Up",
	};
};

export default function Join() {
	let [searchParams] = useSearchParams();
	let redirectTo = searchParams.get("redirectTo") ?? undefined;
	let actionData = useActionData<typeof action>();
	let emailRef = React.useRef<HTMLInputElement>(null);
	let passwordRef = React.useRef<HTMLInputElement>(null);
	let passwordConfirmRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		} else if (actionData?.errors?.passwordConfirm) {
			passwordConfirmRef.current?.focus();
		}
	}, [actionData]);

	return (
		<div className="join-route">
			<h1 className="sr-only">Join</h1>
			<div className="auth-box">
				<Form method="post" className="form">
					<div className="text-field">
						<label htmlFor="email" className="text-field-label">
							Email address
						</label>
						<div className="text-field-input-wrap">
							<InputText
								ref={emailRef}
								id="email"
								required
								autoFocus={true}
								name="email"
								type="email"
								autoComplete="email"
								aria-invalid={actionData?.errors?.email ? true : undefined}
								aria-errormessage={
									actionData?.errors?.email ? "email-error" : undefined
								}
								className="text-field-input"
							/>
							{actionData?.errors?.email && (
								<div className="text-field-messages">
									<div className="text-field-error" id="email-error">
										{actionData.errors.email}
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="text-field">
						<label htmlFor="password" className="text-field-label">
							Password
						</label>
						<div className="text-field-input-wrap">
							<InputText
								id="password"
								ref={passwordRef}
								name="password"
								type="password"
								autoComplete="new-password"
								aria-invalid={actionData?.errors?.password ? true : undefined}
								aria-describedby={
									actionData?.errors?.password ? "password-error" : undefined
								}
								className="text-field-input"
							/>
							{actionData?.errors?.password && (
								<div className="text-field-messages">
									<div className="text-field-error" id="password-error">
										{actionData.errors.password}
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="text-field">
						<label htmlFor="password" className="text-field-label">
							Confirm Password
						</label>
						<div className="text-field-input-wrap">
							<InputText
								id="passwordConfirm"
								ref={passwordConfirmRef}
								name="passwordConfirm"
								type="password"
								autoComplete="new-password"
								aria-invalid={
									actionData?.errors?.passwordConfirm ? true : undefined
								}
								aria-describedby={
									actionData?.errors?.passwordConfirm
										? "password-confirm-error"
										: undefined
								}
								className="text-field-input"
							/>
							{actionData?.errors?.passwordConfirm && (
								<div className="text-field-messages">
									<div className="text-field-error" id="password-confirm-error">
										{actionData.errors.passwordConfirm}
									</div>
								</div>
							)}
						</div>
					</div>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<button type="submit" className="button button-primary">
						Create Account
					</button>
					<p className="auth-postfix">
						Already have an account?{" "}
						<Link
							to={{
								pathname: "/login",
								search: searchParams.toString(),
							}}
						>
							Log in
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
}
