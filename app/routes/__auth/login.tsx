import * as React from "react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getSessionUser } from "~/lib/session.server";
import { verifyLogin } from "~/models/user.server";
import { getSafeRedirect } from "~/lib/utils.server";
import { isValidEmail } from "~/lib/utils";
import { InputCheckbox, InputText } from "~/ui/input";

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
	let redirectTo = getSafeRedirect(formData.get("redirectTo"), "/admin");
	let remember = formData.get("remember");

	if (!isValidEmail(email)) {
		return json(
			{ errors: { email: "Email is invalid", password: null } },
			{ status: 400 }
		);
	}

	if (typeof password !== "string" || password.length === 0) {
		return json(
			{ errors: { email: null, password: "Password is required" } },
			{ status: 400 }
		);
	}

	if (password.length < 8) {
		return json(
			{ errors: { email: null, password: "Password is too short" } },
			{ status: 400 }
		);
	}

	let user = await verifyLogin(email, password);
	if (!user) {
		return json(
			{ errors: { email: "Invalid email or password", password: null } },
			{ status: 400 }
		);
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: remember === "on" ? true : false,
		redirectTo,
	});
}

export const meta: MetaFunction = () => {
	return {
		title: "Login",
	};
};

export default function LoginPage() {
	let [searchParams] = useSearchParams();
	let redirectTo = searchParams.get("redirectTo") || "/admin";
	let actionData = useActionData<typeof action>();
	let emailRef = React.useRef<HTMLInputElement>(null);
	let passwordRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	return (
		<div className="login-route">
			<h1 className="sr-only">Log In</h1>
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
								aria-describedby="email-error"
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
								autoComplete="current-password"
								aria-invalid={actionData?.errors?.password ? true : undefined}
								aria-describedby="password-error"
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

					<div className="checkbox-field">
						<InputCheckbox
							id="remember"
							name="remember"
							className="checkbox-field-input"
						/>
						<label htmlFor="remember" className="checkbox-field-label">
							Remember me
						</label>
					</div>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<button type="submit" className="button button-primary">
						Log In
					</button>
					<div className="auth-postfix">
						Don't have an account?{" "}
						<Link
							to={{
								pathname: "/join",
								search: searchParams.toString(),
							}}
						>
							Sign up
						</Link>
					</div>
				</Form>
			</div>
		</div>
	);
}
