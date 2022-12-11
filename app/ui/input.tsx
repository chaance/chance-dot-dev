import * as React from "react";
import cx from "clsx";

const BASE_CLASS = "cs--input";

const InputBase = React.forwardRef<any, InputBaseProps>(
	({ as: Comp, className, ...props }, forwardedRef) => {
		return (
			<Comp
				ref={forwardedRef}
				className={cx(BASE_CLASS, className)}
				{...props}
			/>
		);
	}
);
InputBase.displayName = "InputBase";

interface InputBaseProps {
	as: "input" | "textarea" | "select";
	[key: string]: any;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
	({ type = "text", ...props }, forwardedRef) => {
		return (
			<InputBase
				as="input"
				ref={forwardedRef}
				{...props}
				type={type}
				className={cx(`${BASE_CLASS}--${type}`)}
			/>
		);
	}
);
InputText.displayName = "InputText";

interface InputTextProps
	extends Omit<
		React.ComponentPropsWithRef<"input">,
		"checked" | "defaultChecked" | "type"
	> {
	type?:
		| "text"
		| "email"
		| "url"
		| "password"
		| "search"
		| "tel"
		| "number"
		| "date"
		| "month"
		| "week"
		| "time"
		| "datetime"
		| "datetime-local";
}

const InputCheckbox = React.forwardRef<HTMLInputElement, InputCheckboxProps>(
	({ ...props }, forwardedRef) => {
		return (
			<InputBase
				as="input"
				ref={forwardedRef}
				{...props}
				type="checkbox"
				className={cx(`${BASE_CLASS}--checkbox`)}
			/>
		);
	}
);
InputCheckbox.displayName = "InputCheckbox";

interface InputCheckboxProps
	extends Omit<React.ComponentPropsWithRef<"input">, "type"> {}

const InputRadio = React.forwardRef<HTMLInputElement, InputRadioProps>(
	({ ...props }, forwardedRef) => {
		return (
			<InputBase
				as="input"
				ref={forwardedRef}
				{...props}
				type="radio"
				className={cx(`${BASE_CLASS}--radio`)}
			/>
		);
	}
);
InputRadio.displayName = "InputRadio";

interface InputRadioProps
	extends Omit<React.ComponentPropsWithRef<"input">, "type"> {}

const InputSelect = React.forwardRef<HTMLSelectElement, InputSelectProps>(
	({ ...props }, forwardedRef) => {
		return (
			<InputBase
				as="select"
				ref={forwardedRef}
				{...props}
				className={cx(`${BASE_CLASS}--select`)}
			/>
		);
	}
);
InputSelect.displayName = "InputSelect";

interface InputSelectProps extends React.ComponentPropsWithRef<"select"> {}

const InputTextarea = React.forwardRef<HTMLTextAreaElement, InputTextareaProps>(
	({ ...props }, forwardedRef) => {
		return (
			<InputBase
				as="textarea"
				ref={forwardedRef}
				{...props}
				className={cx(`${BASE_CLASS}--textarea`)}
			/>
		);
	}
);
InputTextarea.displayName = "InputTextarea";

interface InputTextareaProps extends React.ComponentPropsWithRef<"textarea"> {}

export { InputText, InputCheckbox, InputRadio, InputSelect, InputTextarea };
export type {
	InputTextProps,
	InputCheckboxProps,
	InputRadioProps,
	InputSelectProps,
	InputTextareaProps,
};
