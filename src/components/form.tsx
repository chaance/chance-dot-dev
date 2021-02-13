import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
	PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import isFunction from "lodash/isFunction";
import { useId } from "@reach/auto-id";
import { Box, BoxOwnProps } from "src/components/primitives/box";
const styles = require("./form.module.scss");

const FormContext = React.createContext<FormContextValue | null>(null);

// INCOMPLETE
const FORM_NAME = "Form";
const Form = React.forwardRef(
	<V extends FieldValues>(
		{
			className,
			defaultValues,
			children,
			handleSubmit: handleSubmitProp,
			preventSubmitSuppression,
			...props
		}: React.PropsWithChildren<FormOwnProps<V>>,
		ref: React.ForwardedRef<HTMLFormElement>
	) => {
		const initialFormState = useConstant(() =>
			getInitialFormState(defaultValues)
		);
		const formReducer = useConstant(() => getFormReducer(initialFormState));

		const [state, dispatch] = React.useReducer(formReducer, initialFormState);
		useFormEffects(state, dispatch, {
			handleSubmit({
				fieldValues,
				// setData: onSuccess,
				// setError: onError,
				event,
			}) {
				if (handleSubmitProp) {
					handleSubmitProp(fieldValues, event);
				}
			},
		});

		async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
			if (!preventSubmitSuppression) {
				event.preventDefault();
			}

			const fieldValues = Object.fromEntries(
				new FormData(event.target as HTMLFormElement)
			) as any;
			dispatch({ type: "INIT_SUBMIT", fieldValues, event });

			if (handleSubmitProp) {
				handleSubmitProp(fieldValues, event);
			}
		}

		return (
			<Box
				ref={ref}
				as="form"
				onSubmit={handleSubmit}
				className={[styles.form, className]}
				{...props}
			>
				<FormContext.Provider value={{ defaultValues }}>
					{isFunction(children) ? children({ defaultValues }) : children}
				</FormContext.Provider>
			</Box>
		);
	}
);
Form.displayName = FORM_NAME;

/* -------------------------------------------------------------------------- */

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
	null
);

const FIELD_NAME = "FormField";
const FormField: React.FC<FormFieldProps> = ({
	id: idProp,
	value,
	defaultValue,
	name,
	children,
	required,
	type,
}) => {
	let id = useId(idProp);
	// let formContext = React.useContext(FormContext);
	return (
		<FormFieldContext.Provider
			value={{
				id,
				name,
				required: Boolean(required),
				type: type || "text",
				value,
				defaultValue,
			}}
		>
			{children}
		</FormFieldContext.Provider>
	);
};
FormField.displayName = FIELD_NAME;

/* -------------------------------------------------------------------------- */

const INPUT_DEFAULT_TAG = "input";
const INPUT_NAME = "FormFieldInput";
const FormFieldInput: PolymorphicForwardRefExoticComponent<
	FormFieldInputOwnProps,
	typeof INPUT_DEFAULT_TAG
> = React.forwardRef(
	<T extends React.ElementType = typeof INPUT_DEFAULT_TAG>(
		{
			as,
			className,
			...props
		}: PolymorphicPropsWithoutRef<FormFieldInputOwnProps, T>,
		ref: React.ForwardedRef<React.ElementRef<T>>
	) => {
		let context = useFormFieldContext_internal(props, {
			componentName: INPUT_NAME,
		});
		let comp: React.ElementType = as || INPUT_DEFAULT_TAG;
		return (
			<Box
				ref={ref}
				as={comp}
				className={[styles.input, className]}
				{...props}
				{...context}
			/>
		);
	}
);
FormFieldInput.displayName = INPUT_NAME;

/* -------------------------------------------------------------------------- */

const LABEL_DEFAULT_TAG = "label";
const LABEL_NAME = "FormFieldLabel";
const FormFieldLabel: PolymorphicForwardRefExoticComponent<
	FormFieldLabelOwnProps,
	typeof LABEL_DEFAULT_TAG
> = React.forwardRef(
	<T extends React.ElementType = typeof LABEL_DEFAULT_TAG>(
		{
			as,
			className,
			...props
		}: PolymorphicPropsWithoutRef<FormFieldLabelOwnProps, T>,
		ref: React.ForwardedRef<React.ElementRef<T>>
	) => {
		let comp: React.ElementType = as || LABEL_DEFAULT_TAG;
		return (
			<Box
				ref={ref}
				as={comp}
				className={[styles.label, className]}
				{...props}
			/>
		);
	}
);
FormFieldLabel.displayName = LABEL_NAME;

/* -------------------------------------------------------------------------- */

function useFormFieldContext_internal(
	props: {
		id?: string | undefined;
		name?: string;
		value?: string | undefined;
		defaultValue?: string | undefined;
		required?: boolean | undefined;
		type?: string | undefined;
	},
	opts: { componentName: string }
): FormFieldContextValue {
	let context = React.useContext(FormFieldContext);
	for (let prop of [
		"name",
		"value",
		"defaultValue",
		"required",
		"type",
	] as const) {
		if (context && context[prop] != null && props[prop] != null) {
			throw Error(
				`${opts.componentName} is used inside of a ${FIELD_NAME} component but also has its own ${prop} prop. This is non-deterministic. Choose between using the ${FIELD_NAME} component or passing field-related props directly to ${opts.componentName}.`
			);
		}
	}
	for (let prop of ["name"] as const) {
		if (context == null && props[prop] == null) {
			throw Error(
				`${opts.componentName} does not have a valid ${prop} prop and has no ${prop} context from a ${FIELD_NAME} component. Choose between using the ${FIELD_NAME} component or passing field-related props directly to ${opts.componentName}.`
			);
		}
	}

	let contextFromProps: FormFieldContextValue = {
		id: props.id,
		name: props.name!,
		value: props.value,
		defaultValue: props.defaultValue,
		required: Boolean(props.required),
		type: props.type || "text",
	};

	return context || contextFromProps;
}

// function useFormContext_internal(
// 	props: {
// 		name: string;
// 		value?: string | undefined;
// 		defaultValue?: string | undefined;
// 	},
// 	opts: { componentName: string }
// ): FormContextValue {
// 	let context = React.useContext(FormContext);
// 	if (context && context.defaultValues[props.name]) {
// 		if (props.value != null) {
// 			throw Error(
// 				`${opts.componentName} is used inside of a ${FORM_NAME} component but also has its own value prop. This is non-deterministic. Choose between using the ${FORM_NAME} component or passing value-related props directly to ${opts.componentName}.`
// 			);
// 		}
// 		if (props.defaultValue != null) {
// 			throw Error(
// 				`${opts.componentName} is used inside of a ${FORM_NAME} component but also has its own defaultValue prop. This is non-deterministic. Choose between using the ${FORM_NAME} component or passing value-related props directly to ${opts.componentName}.`
// 			);
// 		}
// 	}

// 	return context!;
// }

function getInitialFormState<V extends FieldValues>(
	defaultFieldValues: V
): FormState<V> {
	return {
		value: "idle",
		fieldValues: defaultFieldValues,
		fieldErrors: getClearFieldErrors(defaultFieldValues),
		formError: null,
		response: null,
		formEvent: null,
	};
}

function getFormReducer<V extends FieldValues>(initialFormState: FormState<V>) {
	return function formReducer(
		state: FormState<V>,
		event: FormEvent<V>
	): FormState<V> {
		switch (event.type) {
			case "INIT_SUBMIT":
				if (state.value !== "submitting" && state.value !== "validating") {
					return {
						value: "validating",
						fieldValues: event.fieldValues,
						response: null,
						formEvent: event.event,
						...getClearErrors(state.fieldValues),
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
						...state,
						value: "submitting",
						fieldValues: state.fieldValues,
						response: null,
						...getClearErrors(state.fieldValues),
					};
				}
				break;
			case "SET_INVALID":
				if (state.value === "validating") {
					return {
						...state,
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
						...state,
						value: "success",
						fieldValues: state.fieldValues,
						response: event.response,
						...getClearErrors(state.fieldValues),
					};
				}
				break;
			case "SET_ERROR":
				return {
					...state,
					value: "error",
					fieldValues: state.fieldValues,
					response: null,
					formError: event.formError || null,
					fieldErrors:
						event.fieldErrors || getClearFieldErrors(state.fieldValues),
				};
			case "RESET":
				if (state.value !== "submitting" && state.value !== "validating") {
					return initialFormState;
				}
				break;
		}
		return state;
	};
}

function useFormEffects<V extends FieldValues>(
	state: FormState<V>,
	dispatch: React.Dispatch<FormEvent<V>>,
	opts: {
		validate?: FieldValidator<V>;
		handleSubmit: (args: {
			fieldValues: V;
			setData(data: any): void;
			setError(error: any): void;
			event: React.FormEvent<HTMLFormElement>;
		}) => any;
	}
) {
	const validateRef = React.useRef(opts.validate);
	const handleSubmitRef = React.useRef(opts.handleSubmit);
	const fieldValuesRef = React.useRef(state.fieldValues);
	const eventRef = React.useRef(state.formEvent);
	React.useEffect(() => {
		validateRef.current = opts.validate;
		handleSubmitRef.current = opts.handleSubmit;
		fieldValuesRef.current = state.fieldValues;
		eventRef.current = state.formEvent;
	});

	React.useEffect(() => {
		let isCurrent = true;
		if (state.value === "validating") {
			const validate = validateRef.current;
			const fieldValues = fieldValuesRef.current;
			if (validate) {
				validate(fieldValues).then(({ valid, fieldErrors }) => {
					if (!isCurrent) {
						return;
					}

					if (valid) {
						dispatch({ type: "SET_VALID" });
					} else {
						dispatch({ type: "SET_INVALID", fieldErrors });
					}
				});
			} else {
				dispatch({ type: "SET_VALID" });
			}
		} else if (state.value === "submitting") {
			const fieldValues = fieldValuesRef.current;
			const handleSubmit = handleSubmitRef.current;
			let event = eventRef.current!;

			if (handleSubmit) {
				handleSubmit({ fieldValues, setData, setError, event });
			}
		}
		return () => {
			isCurrent = false;
		};

		function setError(error: any) {
			dispatch({ type: "SET_ERROR", formError: error });
		}

		function setData(data: any) {
			dispatch({ type: "SET_DATA", response: data });
		}
	}, [state.value, dispatch]);
}

// function getClearFields<V extends FieldValues>(fieldValues: V) {
// 	return Object.keys(fieldValues).reduce<V>((acc, _k) => {
// 		const key = _k as keyof V;
// 		if (Array.isArray(fieldValues[key])) {
// 			return { ...acc, [key]: [] };
// 		}
// 		if (typeof fieldValues[key] === "boolean") {
// 			return { ...acc, [key]: false };
// 		}
// 		return { ...acc, [key]: null };
// 	}, {} as any);
// }

function getClearFieldErrors<V extends FieldValues>(fieldValues: V) {
	return Object.keys(fieldValues).reduce<Record<keyof V, null>>(
		(acc, key) => ({ ...acc, [key]: null }),
		{} as any
	);
}

function getClearErrors<V extends FieldValues>(fieldValues: V) {
	return {
		formError: null,
		fieldErrors: {
			...getClearFieldErrors(fieldValues),
		},
	};
}

function useConstant<T>(fn: () => T): T {
	const ref = React.useRef<{ v: T }>();
	if (!ref.current) {
		ref.current = { v: fn() };
	}
	return ref.current.v;
}

type FormStateValue =
	| "idle"
	| "validating"
	| "submitting"
	| "success"
	| "error";

interface FormState<V extends FieldValues> {
	value: FormStateValue;
	formError: any;
	fieldValues: V;
	fieldErrors: FieldErrors<V>;
	response: any;
	formEvent: React.FormEvent<HTMLFormElement> | null;
}

type FormEvent<V extends FieldValues> =
	| {
			type: "INIT_SUBMIT";
			fieldValues: V;
			event: React.FormEvent<HTMLFormElement>;
	  }
	| { type: "UPDATE_FIELD"; name: keyof V; value: ValueOf<V> }
	| { type: "SET_VALID" }
	| { type: "SET_INVALID"; fieldErrors: FieldErrors<V> }
	| { type: "RESET" }
	| { type: "SET_DATA"; response: any }
	| {
			type: "SET_ERROR";
			formError?: any;
			fieldErrors?: FieldErrors<V>;
	  };

type FieldValidator<V extends FieldValues> = (
	fields: Partial<V>
) => Promise<{ valid: boolean; fieldErrors: FieldErrors<V> }>;

type FieldErrors<V extends FieldValues> = Record<keyof V, string | null>;

type FieldValues = Record<string, string | boolean | Array<"string">>;

interface FormContextValue {
	defaultValues: FieldValues;
}

interface FormFieldContextValue {
	id: string | undefined;
	value: string | undefined;
	defaultValue: string | undefined;
	name: string;
	required: boolean;
	type: string;
}

interface FormFieldProps {
	id?: string;
	value?: string;
	defaultValue?: string;
	name: string;
	required?: boolean;
	type?: string | undefined;
}

interface FormOwnProps<V extends FieldValues> extends BoxOwnProps {
	handleSubmit?(fieldValues: V, event: React.FormEvent<HTMLFormElement>): any;
	preventSubmitSuppression?: boolean;
	defaultValues: V;
	children:
		| React.ReactNode
		| ((props: { defaultValues: V }) => React.ReactNode);
}

interface FormFieldInputOwnProps extends BoxOwnProps {}

interface FormFieldLabelOwnProps extends BoxOwnProps {}

type FormFieldInputProps<
	T extends React.ElementType = typeof INPUT_DEFAULT_TAG
> = PolymorphicPropsWithRef<FormFieldInputOwnProps, T>;

type FormFieldLabelProps<
	T extends React.ElementType = typeof LABEL_DEFAULT_TAG
> = PolymorphicPropsWithRef<FormFieldLabelOwnProps, T>;

type HTMLInputType =
	| "button"
	| "checkbox"
	| "color"
	| "date"
	| "datetime" // deprecated
	| "datetime-local"
	| "email"
	| "file"
	| "hidden"
	| "image"
	| "month"
	| "number"
	| "password"
	| "radio"
	| "range"
	| "reset"
	| "search"
	| "submit"
	| "tel"
	| "text"
	| "time"
	| "url"
	| "week";

export { FormField, FormFieldInput, FormFieldLabel };
export type {
	FormFieldProps,
	FormFieldInputOwnProps,
	FormFieldInputProps,
	FormFieldLabelOwnProps,
	FormFieldLabelProps,
	HTMLInputType,
};

type ValueOf<O> = O[keyof O];
