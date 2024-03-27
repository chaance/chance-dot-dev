import { Form } from "@remix-run/react";
import * as React from "react";
import { bem } from "~/lib/utils";
import { InputText } from "~/ui/input";
import { Button } from "~/ui/primitives/button";

const SignUpForm = React.forwardRef<HTMLFormElement, SignUpFormProps>(
	(
		{
			formComponent: FormComp = Form,
			fields,
			submitButton,
			formAction = "/sign-up",
			...props
		},
		forwardedRef
	) => {
		const ROOT_CLASS = "sign-up-form";
		return (
			<FormComp
				ref={forwardedRef}
				action={formAction}
				method="post"
				className={ROOT_CLASS}
			>
				<div className={`${ROOT_CLASS}__fields`}>{fields}</div>
				<div className={`${ROOT_CLASS}__submit`}>{submitButton}</div>
			</FormComp>
		);
	}
);
SignUpForm.displayName = "SignUpForm";

interface SignUpFormProps {
	fields: React.ReactNode;
	formAction?: string;
	formComponent?: typeof Form | "form";
	ref?: React.Ref<HTMLFormElement>;
	submitButton: React.ReactNode;
}

function SignUpFormField({
	name,
	type = "text",
	required,
	label,
	id,
	placeholder,
	errorMessage,
	defaultValue,
	onChange,
	onBlur,
	onFocus,
}: SignUpFormFieldProps) {
	const ROOT_CLASS = "sign-up-form-field";
	let errorMessageId = `${id}-error`;
	let ariaInvalid = errorMessage ? true : undefined;
	let ariaErrormessage = errorMessage ? errorMessageId : undefined;

	return (
		<div className={ROOT_CLASS}>
			<div className={bem(ROOT_CLASS, "field-group")}>
				<div className={bem(ROOT_CLASS, "label")}>
					<label className="text-body" htmlFor={id}>
						{label}
					</label>
				</div>
				<InputText
					name={name}
					id={id}
					type={type}
					required={required || undefined}
					placeholder={placeholder}
					aria-invalid={ariaInvalid}
					aria-errormessage={ariaErrormessage}
					defaultValue={defaultValue || undefined}
					onChange={onChange}
					onBlur={onBlur}
					onFocus={onFocus}
					className={bem(ROOT_CLASS, "input")}
				/>
			</div>
			{errorMessage ? (
				<div id={errorMessageId} className={bem(ROOT_CLASS, "error-message")}>
					{errorMessage.split("\n").map((line, i) => {
						return (
							<span className="text-critical text-body-sm" key={line}>
								{line}
							</span>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

interface SignUpFormFieldProps {
	name: string;
	label: string;
	type?: "text" | "email";
	required?: boolean;
	placeholder?: string;
	errorMessage?: string | null;
	id: string;
	defaultValue?: string | null;
	onChange?(
		evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void;
	onBlur?(evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
	onFocus?(evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}

const SignUpFormBasic = React.forwardRef<HTMLFormElement, SignUpFormBasicProps>(
	(
		{
			formComponent = Form,
			nameError,
			nameDefaultValue,
			emailError,
			emailDefaultValue,
		},
		forwardedRef
	) => {
		return (
			<SignUpForm
				ref={forwardedRef}
				formComponent={formComponent}
				fields={
					<>
						<SignUpFormField
							id="form-field-name"
							name="name"
							errorMessage={nameError}
							defaultValue={nameDefaultValue || undefined}
							label="Your name"
							required
							type="text"
						/>
						<SignUpFormField
							id="form-field-email"
							name="email"
							errorMessage={emailError}
							defaultValue={emailDefaultValue || undefined}
							label="Email"
							required
							type="email"
						/>
					</>
				}
				submitButton={
					<Button type="submit" className="button button-primary button-block">
						Sign Up
					</Button>
				}
			/>
		);
	}
);

SignUpFormBasic.displayName = "SignUpFormBasic";

interface SignUpFormBasicProps {
	ref?: React.Ref<HTMLFormElement>;
	formComponent?: typeof Form | "form";
	nameError?: string | null;
	nameDefaultValue?: string | null;
	emailError?: string | null;
	emailDefaultValue?: string | null;
}

export type { SignUpFormProps, SignUpFormFieldProps, SignUpFormBasicProps };
export { SignUpForm, SignUpFormField, SignUpFormBasic };
