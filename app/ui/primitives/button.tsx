import * as React from "react";
import type { PressEvents, FocusableProps } from "~/types/react-aria";
import { type AriaButtonProps, useButton as useReactAriaButton } from "react-aria";

function Button({ children, ref: forwardedRef, ...props }: ButtonProps) {
	let ref = React.useRef<HTMLButtonElement>(null);
	let { buttonProps } = useButton(
		{
			...props,
			onClick: props.onClick as (event: React.MouseEvent<any, MouseEvent>) => void,
			excludeFromTabOrder: props.tabIndex != null && props.tabIndex !== 0,
			isDisabled: props.disabled,
		},
		ref as React.RefObject<HTMLButtonElement | HTMLDivElement>,
	);
	return (
		<button ref={forwardedRef} {...buttonProps}>
			{children}
		</button>
	);
}

function ButtonDiv({ children, ref: forwardedRef, ...props }: ButtonDivProps) {
	let ref = React.useRef<HTMLDivElement | null>(null);
	let { buttonProps } = useButton(
		{
			...props,
			onClick: props.onClick as (event: React.MouseEvent<any, MouseEvent>) => void,
			elementType: "div",
			excludeFromTabOrder: props.tabIndex != null && props.tabIndex !== 0,
			isDisabled: props.disabled,
		},
		ref as React.RefObject<HTMLButtonElement | HTMLDivElement>,
	);
	return (
		<div ref={forwardedRef} {...buttonProps}>
			{children}
		</div>
	);
}

function useButton<Elem extends HTMLDivElement | HTMLButtonElement>(
	props: Omit<
		AriaButtonProps<Elem extends HTMLButtonElement ? "button" : "div">,
		keyof PressEvents | keyof FocusableProps
	> &
		PressEvents<Elem> &
		FocusableProps<Elem>,
	ref: React.RefObject<Elem>,
) {
	const {
		autoFocus,
		elementType,
		excludeFromTabOrder,
		isDisabled,
		onBlur,
		onFocus,
		onFocusChange,
		onPress,
		onPressChange,
		onPressEnd,
		onPressStart,
		onPressUp,
		...domProps
	} = props;
	let { buttonProps, isPressed } = useReactAriaButton(props as any, ref);
	return {
		buttonProps: {
			...domProps,
			...buttonProps,
		},
		isPressed,
	};
}

interface ButtonOwnProps extends PressEvents<HTMLButtonElement>, FocusableProps<HTMLButtonElement> {
	value?: string | undefined;
}

interface ButtonProps
	extends ButtonOwnProps, Omit<React.ComponentPropsWithRef<"button">, keyof ButtonOwnProps> {}

interface ButtonDivOwnProps extends PressEvents<HTMLDivElement>, FocusableProps<HTMLDivElement> {
	disabled?: boolean;
}

interface ButtonDivProps
	extends ButtonDivOwnProps, Omit<React.ComponentPropsWithRef<"div">, keyof ButtonDivOwnProps> {}

export type { ButtonProps, ButtonDivProps };
export { Button, ButtonDiv };
