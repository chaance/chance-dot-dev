import * as React from "react";
import { useToggleState } from "@react-stately/toggle";
import { useCheckbox } from "@react-aria/checkbox";
import { useRadio, useRadioGroup } from "@react-aria/radio";
import { useRadioGroupState, type RadioGroupState } from "@react-stately/radio";
import { useFocusRing } from "@react-aria/focus";
import { usePress } from "@react-aria/interactions";
import cx from "clsx";
import { useComposedRefs } from "~/lib/react/use-composed-refs";

// annoying af but the type is exposed in a dependency of
// @react-aria/interactions instead of that package itself, and that seems like
// an implementation detail instead of a package I want to depend on directly.
type PressEventHandler = Parameters<typeof usePress>[0]["onPress"];

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

function useCheckboxInput({
	disabled: isDisabled,
	readOnly: isReadOnly,
	required: isRequired,
	checked: isSelected,
	defaultChecked: defaultSelected,
	onToggle,
	indeterminate: isIndeterminate,
	wrapperProps: {
		onPress,
		onPressStart,
		onPressEnd,
		onPressUp,
		onPressChange,
		...wrapperProps
	} = {},
	wrapperRef,
	...props
}: InputCheckboxProps) {
	let ariaInvalid = props["aria-invalid"];
	const validationState =
		ariaInvalid === true || ariaInvalid === "true" ? "invalid" : "valid";

	let state = useToggleState({
		...props,
		isDisabled,
		isReadOnly,
		isRequired,
		isSelected,
		defaultSelected,
		validationState,
		onChange: onToggle,
		// TODO: deal with type and submit a PR to react-stately. Ideally
		// useToggleState would be generic and accept the element types for
		// target and relatedTarget.
		// useToggleState<HTMLInputElement>(props);
		onFocus: props.onFocus as any,
		onBlur: props.onBlur as any,
	});

	let excludeFromTabOrder = props.tabIndex != null && props.tabIndex !== 0;
	let inputRef = React.useRef<HTMLInputElement | null>(null);
	let svgRef = React.useRef<SVGSVGElement | null>(null);

	let { pressProps, isPressed } = usePress({
		...wrapperProps,
		isDisabled,
		preventFocusOnPress: true,
		onPress(evt) {
			let target = evt.target;
			let label = target.closest("label");
			let control = label?.control;
			if (!control && evt.pointerType !== "keyboard") {
				state.setSelected(!state.isSelected);
				inputRef.current?.focus();
			}
			onPress?.(evt);
		},
		onPressStart,
		onPressEnd,
		onPressUp,
		onPressChange,
		ref: svgRef as React.RefObject<Element>,
	});

	let { inputProps } = useCheckbox(
		{
			...props,
			isIndeterminate,
			isDisabled,
			isReadOnly,
			isRequired,
			isSelected,
			defaultSelected,
			// TODO: deal with type and submit a PR to react-aria
			onFocus: props.onFocus as any,
			onBlur: props.onBlur as any,
			excludeFromTabOrder,
			"aria-label":
				// Annoying react aria warning. Throw away.
				"hi",
			validationState,
			onChange: onToggle,
		},
		state,
		inputRef
	);

	inputProps["aria-label"] = props["aria-label"];

	let { isFocused, focusProps } = useFocusRing(props);
	let isVisuallySelected = state.isSelected && !isIndeterminate;

	return {
		isFocused,
		isVisuallySelected,
		isPressed,
		isIndeterminate,
		isSelected,
		isDisabled,
		focusProps,
		wrapperRef: useComposedRefs(svgRef, wrapperRef),
		wrapperProps: {
			...wrapperProps,
			...pressProps,
		},
		inputRef,
		inputProps: {
			...inputProps,
			...focusProps,
		},
	};
}

function useRadioInput({
	disabled: isDisabled,
	readOnly: isReadOnly,
	required: isRequired,
	onToggle,
	wrapperProps: {
		onPress,
		onPressStart,
		onPressEnd,
		onPressUp,
		onPressChange,
		...wrapperProps
	} = {},
	wrapperRef,
	...props
}: InputRadioProps) {
	let { state } = useRadioGroupContext();
	let inputRef = React.useRef<HTMLInputElement | null>(null);
	let svgRef = React.useRef<SVGSVGElement | null>(null);

	let { pressProps, isPressed } = usePress({
		...wrapperProps,
		isDisabled,
		preventFocusOnPress: true,
		onPress(evt) {
			let target = evt.target;
			let label = target.closest("label");
			let control = label?.control;
			if (!control && evt.pointerType !== "keyboard") {
				state.setSelectedValue(props.value);
				inputRef.current?.focus();
			}
			onPress?.(evt);
		},
		onPressStart,
		onPressEnd,
		onPressUp,
		onPressChange,
		ref: svgRef as React.RefObject<Element>,
	});

	let { inputProps } = useRadio(
		{
			...props,
			isDisabled,
			// TODO: deal with type and submit a PR to react-aria
			onFocus: props.onFocus as any,
			onBlur: props.onBlur as any,
			"aria-label":
				// Annoying react aria warning. Throw away.
				"hi",
		},
		state,
		inputRef
	);

	inputProps["aria-label"] = props["aria-label"];

	let { isFocused, focusProps } = useFocusRing(props);

	return {
		isFocused,
		isPressed,
		isSelected: state.selectedValue === props.value,
		isDisabled,
		focusProps,
		wrapperRef: useComposedRefs(svgRef, wrapperRef),
		wrapperProps: {
			...wrapperProps,
			...pressProps,
		},
		inputRef,
		inputProps: {
			...inputProps,
			...focusProps,
		},
	};
}

const InputCheckbox = React.forwardRef<HTMLInputElement, InputCheckboxProps>(
	(props, forwardedRef) => {
		let generatedId = React.useId();
		let id = props.id || `checkbox:${generatedId}`;
		let {
			inputProps,
			inputRef,
			isDisabled,
			isFocused,
			isIndeterminate,
			isPressed,
			isVisuallySelected,
			wrapperProps,
			wrapperRef,
		} = useCheckboxInput({ ...props, id });
		let ref = useComposedRefs(forwardedRef, inputRef);

		return (
			<>
				<InputBase
					as="svg"
					ref={wrapperRef}
					{...wrapperProps}
					className={cx(`${BASE_CLASS}--checkbox`, {
						[`${BASE_CLASS}--checked`]: isVisuallySelected,
						[`${BASE_CLASS}--disabled`]: isDisabled,
						[`${BASE_CLASS}--focused`]: isFocused,
						[`${BASE_CLASS}--active`]: isPressed,
					})}
					aria-hidden
					viewBox="0 0 24 24"
				>
					<rect width={24} height={24} className={`${BASE_CLASS}__accent`} />
					{isVisuallySelected && (
						<path
							transform="translate(9 9) scale(1.3)"
							className={`${BASE_CLASS}__marker`}
							d={`M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1
            1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712
            6A.999.999 0 0 1 3.788 9z`}
						/>
					)}
					{isIndeterminate && (
						<rect x={7} y={11} width={10} height={2} fill="gray" />
					)}
					{/* {isFocusVisible && (
						<rect
							x={1}
							y={1}
							width={22}
							height={22}
							fill="none"
							stroke="orange"
							strokeWidth={2}
						/>
					)} */}
				</InputBase>
				<div className="sr-only">
					<input {...inputProps} aria-label={props["aria-label"]} ref={ref} />
				</div>
			</>
		);
	}
);
InputCheckbox.displayName = "InputCheckbox";

interface InputToggleProps
	extends Omit<
		React.ComponentPropsWithRef<"input">,
		"type" | "value" | "defaultValue"
	> {
	onToggle?(isSelected: boolean): void;
	value?: string;
}

type InputToggleWrapperProps<E extends React.ElementType> =
	React.ComponentPropsWithoutRef<E> & {
		onPress?: PressEventHandler;
		onPressStart?: PressEventHandler;
		onPressEnd?: PressEventHandler;
		onPressUp?: PressEventHandler;
		onPressChange?(isPressed: boolean): void;
	};

interface InputCheckboxProps extends InputToggleProps {
	wrapperProps?: InputToggleWrapperProps<"svg">;
	wrapperRef?: React.Ref<SVGSVGElement>;
	indeterminate?: boolean;
}

interface InputRadioGroupProps extends React.ComponentPropsWithRef<"div"> {
	children?: React.ReactNode;
	orientation?: "horizontal" | "vertical";
	value?: string;
	/** The default value (uncontrolled). */
	defaultValue?: string;
	onValueChange?(value: string): void;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	validationState?: "valid" | "invalid";
	description?: React.ReactNode;
	errorMessage?: React.ReactNode;
	name: string;
}

const RadioGroupContext = React.createContext<{
	state: RadioGroupState;
	labelProps: React.DOMAttributes<HTMLSpanElement>;
	descriptionProps: React.DOMAttributes<HTMLDivElement>;
	errorMessageProps: React.DOMAttributes<HTMLDivElement>;
	validationState: "valid" | "invalid" | undefined;
} | null>(null);
RadioGroupContext.displayName = "RadioGroupContext";

function useRadioGroupContext() {
	let context = React.useContext(RadioGroupContext);
	if (context == null) {
		throw new Error("RadioGroupContext is missing");
	}
	return context;
}

const InputRadioGroup = React.forwardRef<HTMLDivElement, InputRadioGroupProps>(
	(
		{
			onValueChange,
			disabled: isDisabled,
			readOnly: isReadOnly,
			required: isRequired,
			...props
		},
		ref
	) => {
		let generatedId = React.useId();
		let id = props.id || `radio-group:${generatedId}`;

		let { children, validationState } = props;
		let state = useRadioGroupState({
			...props,
			// @ts-ignore
			id,
			onChange: onValueChange,
			isDisabled,
			isReadOnly,
			isRequired,
		});
		let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
			useRadioGroup(
				{
					...props,
					id,
					onChange: onValueChange,
					isDisabled,
					isReadOnly,
					isRequired,
					"aria-label":
						// Annoying react aria warning. Throw away.
						"hi",
				},
				state
			);

		radioGroupProps["aria-label"] = props["aria-label"];

		return (
			<div {...radioGroupProps} ref={ref}>
				<RadioGroupContext.Provider
					value={{
						state,
						labelProps,
						descriptionProps,
						errorMessageProps,
						validationState,
					}}
				>
					{children}
				</RadioGroupContext.Provider>
			</div>
		);
	}
);
InputRadioGroup.displayName = "InputRadioGroup";

const InputRadioGroupLabel = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithRef<"span">
>((props, ref) => {
	let { labelProps } = useRadioGroupContext();
	return <span ref={ref} {...labelProps} {...props} />;
});
InputRadioGroupLabel.displayName = "InputRadioGroupLabel";

const InputRadioGroupDescription = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div">
>((props, ref) => {
	let { descriptionProps } = useRadioGroupContext();
	return <div ref={ref} {...descriptionProps} {...props} />;
});
InputRadioGroupDescription.displayName = "InputRadioGroupDescription";

const InputRadioGroupErrorMessage = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div"> & {
		renderWhenValid?: boolean;
	}
>(({ renderWhenValid, ...props }, ref) => {
	let { errorMessageProps, validationState } = useRadioGroupContext();
	return renderWhenValid || validationState === "invalid" ? (
		<div ref={ref} {...errorMessageProps} {...props} />
	) : null;
});
InputRadioGroupErrorMessage.displayName = "InputRadioGroupErrorMessage";

const InputRadio = React.forwardRef<HTMLInputElement, InputRadioProps>(
	(props, forwardedRef) => {
		let generatedId = React.useId();
		let id = props.id || `radio:${generatedId}`;
		let {
			inputProps,
			inputRef,
			isDisabled,
			isFocused,
			isPressed,
			isSelected,
			wrapperProps,
			wrapperRef,
		} = useRadioInput({ ...props, id });
		let ref = useComposedRefs(forwardedRef, inputRef);

		return (
			<>
				<InputBase
					as="svg"
					ref={wrapperRef}
					{...wrapperProps}
					className={cx(`${BASE_CLASS}--radio`, {
						[`${BASE_CLASS}--checked`]: isSelected,
						[`${BASE_CLASS}--disabled`]: isDisabled,
						[`${BASE_CLASS}--focused`]: isFocused,
						[`${BASE_CLASS}--active`]: isPressed,
					})}
					aria-hidden
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="12" r="12" className={`${BASE_CLASS}__accent`} />
					{isSelected && (
						<circle className={`${BASE_CLASS}__marker`} cx="12" cy="12" r="6" />
					)}
				</InputBase>
				<div className="sr-only">
					<input {...inputProps} aria-label={props["aria-label"]} ref={ref} />
				</div>
			</>
		);
	}
);
InputRadio.displayName = "InputRadio";

interface InputRadioProps
	extends Omit<
		React.ComponentPropsWithRef<"input">,
		"type" | "value" | "defaultValue" | "checked" | "defaultChecked"
	> {
	value: string;
	wrapperProps?: InputToggleWrapperProps<"svg">;
	wrapperRef?: React.Ref<SVGSVGElement>;
	onToggle?(isSelected: boolean): void;
}

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

export {
	InputText,
	InputCheckbox,
	InputRadio,
	InputSelect,
	InputTextarea,
	InputRadioGroup,
	InputRadioGroupDescription,
	InputRadioGroupLabel,
	InputRadioGroupErrorMessage,
};
export type {
	InputTextProps,
	InputCheckboxProps,
	InputRadioProps,
	InputRadioGroupProps,
	InputSelectProps,
	InputTextareaProps,
};
