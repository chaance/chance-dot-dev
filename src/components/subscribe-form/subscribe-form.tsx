import React from "react";
// import * as Yup from "yup";
import { VisuallyHidden } from "@reach/visually-hidden";
import { Alert as ReachAlert } from "@reach/alert";
import { Button } from "$components/button";
import { Box, BoxProps } from "$components/primitives/box";
import { H2 } from "$components/heading";
import { P } from "$components/html";
import { FormFieldInput, FormFieldLabel } from "$components/form";
const styles = require("./subscribe-form.module.scss");

// const SubscribeSchema = Yup.object().shape({
// 	email: Yup.string().email("Invalid email address").required("Required"),
// 	name: Yup.string(),
// });

const Alert: React.FC<{
	children: React.ReactNode;
	type?: "error" | "success" | "generic";
	alertMode?: "agressive" | "polite";
}> = ({
	children,
	type = "generic",
	alertMode = type === "error" ? "agressive" : "polite",
}) => {
	return (
		<Box className={styles.alertWrapper}>
			<Box
				as={ReachAlert}
				className={[styles.alert, styles[type + "Alert"]]}
				type={alertMode}
			>
				{children}
			</Box>
		</Box>
	);
};

// TODO: This should be in a live region probably
const PostSubmissionMessage = ({ response }: { response: any }) => {
	let innerText: string;
	switch (response?.subscription?.state) {
		case "active":
			innerText =
				"Your subscription is active and you will hear from me very soon!";
			break;
		default:
			innerText =
				"Thanks! Please check your inbox to confirm your subscription.";
	}
	return (
		<Alert type="success">
			<P>{innerText}</P>
		</Alert>
	);
};

const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM;

const initialFormState: FormState = {
	value: "idle",
	fieldValues: {
		email: null,
		first_name: null,
	},
	fieldErrors: {
		email: null,
		first_name: null,
	},
	formError: null,
	response: null,
};

const SubscribeForm: React.FC<BoxProps<"div">> = ({ className, ...props }) => {
	const [state, dispatch] = React.useReducer(formReducer, initialFormState);
	useFormEffects(state, dispatch);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		dispatch({
			type: "INIT_SUBMIT",
			fieldValues: Object.fromEntries(
				new FormData(event.target as HTMLFormElement)
			) as any,
		});
	}

	return (
		<Box as="div" className={[styles.wrapper, className]} {...props}>
			<H2 className={styles.heading}>Let's chat! 👋</H2>
			{shouldShowForm(state) && (
				<Box className={styles.intro}>
					<P>
						Occasionally I will send articles and thoughts on code, JavaScript,
						business, and anything else that happens to be on my mind. I'd love
						it if you'd join me, and I promise not to spam your inbox! You can
						always unsubscribe, no hard feelings (though I can't promise I won't
						miss you).
					</P>
				</Box>
			)}

			{shouldShowForm(state) && (
				<form onSubmit={handleSubmit} className={styles.form}>
					<Box as="label" className={styles.inputWrapper}>
						<FormFieldLabel as="span">
							First Name
							{/* {shouldShowFieldError(state, "first_name") && (
								<span>{state.fieldErrors.first_name}</span>
							)} */}
						</FormFieldLabel>
						<FormFieldInput
							aria-label="Your first name"
							aria-required="false"
							name="first_name"
							placeholder="Alf"
							type="text"
							className={styles.input}
						/>
					</Box>
					<Box as="label" className={styles.inputWrapper}>
						<FormFieldLabel as="span">
							<span>Email </span>
							<span className={styles.required} aria-hidden>
								*
							</span>
							<VisuallyHidden>Required Field</VisuallyHidden>
							{/* {shouldShowFieldError(state, "email") && (
								<span>{state.fieldErrors.email}</span>
							)} */}
						</FormFieldLabel>
						<FormFieldInput
							aria-label="Your email address"
							aria-required="true"
							name="email"
							placeholder="alf@melmac.com"
							type="email"
							required
							className={styles.input}
						/>
					</Box>
					<Button
						disabled={shouldDisableSubmit(state) || undefined}
						data-element="submit"
						type="submit"
						className={styles.submitButton}
					>
						{shouldDisableSubmit(state) ? "Subscribing..." : "Subscribe"}
					</Button>
				</form>
			)}
			{shouldShowSuccessMessage(state) && (
				<PostSubmissionMessage response={state.response} />
			)}
			{shouldShowFormError(state) && (
				<Alert type="error">
					<P>{state.formError}</P>
				</Alert>
			)}
		</Box>
	);
};

export { SubscribeForm };

function formReducer(state: FormState, event: FormEvent): FormState {
	switch (event.type) {
		case "INIT_SUBMIT":
			if (state.value !== "submitting" && state.value !== "validating") {
				return {
					value: "validating",
					fieldValues: event.fieldValues,
					response: null,
					...getClearErrors(),
				};
			}
			break;
		case "UPDATE_FIELD":
			if (state.value !== "submitting" && state.value !== "validating") {
				return {
					...state,
					fieldValues: {
						...state.fieldValues,
						[event.name]: event.value,
					},
				};
			}
			break;
		case "SET_VALID":
			if (state.value === "validating") {
				return {
					value: "submitting",
					fieldValues: state.fieldValues,
					response: null,
					...getClearErrors(),
				};
			}
			break;
		case "SET_INVALID":
			if (state.value === "validating") {
				return {
					value: "error",
					fieldValues: state.fieldValues,
					response: null,
					formError: null,
					fieldErrors: event.fieldErrors,
				};
			}
			break;
		case "SET_DATA":
			if (state.value === "submitting") {
				return {
					value: "success",
					fieldValues: state.fieldValues,
					response: event.response,
					...getClearErrors(),
				};
			}
			break;
		case "SET_ERROR":
			return {
				value: "error",
				fieldValues: state.fieldValues,
				response: null,
				formError: event.formError || null,
				fieldErrors: event.fieldErrors || getClearFields(),
			};
		case "RESET":
			if (state.value !== "submitting" && state.value !== "validating") {
				return initialFormState;
			}
			break;
	}
	return state;
}

async function validateFields(
	fields: Partial<FormFields>
): Promise<{ valid: boolean; fieldErrors: FieldErrors }> {
	const fieldsWithValues: Partial<FormFields> = {};
	for (const field in fields) {
		if ((fields as any)[field] != null) {
			(fieldsWithValues as any)[field] = (fields as any)[field];
		}
	}
	// We will rely on browser validation until/unless we need anything extra
	return await Promise.resolve({
		valid: true,
		fieldErrors: getClearFields(),
	});
	// try {
	// 	await SubscribeSchema.validate(fieldsWithValues, {
	// 		abortEarly: false,
	// 	});
	// } catch (err: any) {
	// 	return {
	// 		fieldErrors: (err as Yup.ValidationError).inner.reduce<FieldErrors>(
	// 			(allErrors, currentError) => {
	// 				return currentError.path != null
	// 					? {
	// 							...allErrors,
	// 							[currentError.path]: currentError.message,
	// 					  }
	// 					: allErrors;
	// 			},
	// 			getClearFields()
	// 		),
	// 	};
	// }
}

type FormStateValue =
	| "idle"
	| "validating"
	| "submitting"
	| "success"
	| "error";

interface FormFields {
	email: string | null | undefined;
	first_name: string | null | undefined;
}

type FieldErrors = Record<keyof FormFields, string | null>;

interface FormState {
	value: FormStateValue;
	formError: string | null;
	fieldValues: FormFields;
	fieldErrors: FieldErrors;
	response: any;
}
type FormEvent =
	| { type: "INIT_SUBMIT"; fieldValues: FormFields }
	| { type: "UPDATE_FIELD"; name: keyof FormFields; value: ValueOf<FormFields> }
	| { type: "SET_VALID" }
	| { type: "SET_INVALID"; fieldErrors: FieldErrors }
	| { type: "RESET" }
	| { type: "SET_DATA"; response: any }
	| { type: "SET_ERROR"; formError?: string | null; fieldErrors?: FieldErrors };

function getClearFields() {
	return {
		email: null,
		first_name: null,
	};
}

function getClearErrors() {
	return {
		formError: null,
		fieldErrors: {
			...getClearFields(),
		},
	};
}

function shouldShowForm(state: FormState) {
	return state.value !== "success";
}

function shouldDisableSubmit(state: FormState) {
	return state.value === "submitting" || state.value === "validating";
}

// function shouldShowFieldError(state: FormState, field: keyof FormFields) {
// 	return state.value === "error" || state.fieldErrors[field] != null;
// }

function shouldShowFormError(state: FormState) {
	return state.value === "error" || state.formError != null;
}

function shouldShowSuccessMessage(state: FormState) {
	return state.value === "success";
}

function useFormEffects(state: FormState, dispatch: React.Dispatch<FormEvent>) {
	const fieldValuesRef = React.useRef(state.fieldValues);
	React.useEffect(() => {
		fieldValuesRef.current = state.fieldValues;
	}, [state.fieldValues]);

	React.useEffect(() => {
		let isCurrent = true;
		if (state.value === "validating") {
			const fieldValues = fieldValuesRef.current;
			validateFields(fieldValues).then(({ valid, fieldErrors }) => {
				if (!isCurrent) {
					return;
				}

				if (valid) {
					dispatch({ type: "SET_VALID" });
				} else {
					dispatch({ type: "SET_INVALID", fieldErrors });
				}
			});
		} else if (state.value === "submitting") {
			const url = `https://api.convertkit.com//v3/forms/${FORM_ID}/subscribe`;
			const fieldValues = fieldValuesRef.current;

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...fieldValues,
					api_key: process.env.NEXT_PUBLIC_CONVERTKIT_PUBLIC_KEY,
				}),
			})
				.then((response) => {
					if (response.status === 200) {
						console.log(response);
						response.headers.forEach(console.log);
						return response.json();
					}
					switch (response.status) {
						case 401:
							throw Error("Authorization error");
					}
					console.error(response);
					throw Error("Something bad happened!");
				})
				.then((response) => {
					if (isCurrent) {
						dispatch({ type: "SET_DATA", response });
					}
				})
				.catch((err: any) => {
					if (isCurrent) {
						dispatch({ type: "SET_ERROR", formError: "Something went wrong!" });
						console.error(err);
					}
				});
		}
		return () => {
			isCurrent = false;
		};
	}, [state.value, dispatch]);
}

type ValueOf<O> = O[keyof O];
