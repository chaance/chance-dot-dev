import * as React from "react";
import type { PressEvents, FocusableProps } from "~/types/react-aria";
import {
	type AriaButtonProps,
	useButton as useReactAriaButton,
} from "react-aria";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, forwardedRef) => {
		let ref = React.useRef<HTMLButtonElement>(null);
		let { buttonProps } = useButton(
			{
				...props,
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
	},
);
Button.displayName = "Button";

const ButtonDiv = React.forwardRef<HTMLDivElement, ButtonDivProps>(
	({ children, ...props }, forwardedRef) => {
		let ref = React.useRef<HTMLDivElement | null>(null);
		let { buttonProps } = useButton(
			{
				...(props as any),
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
	},
);
ButtonDiv.displayName = "ButtonDiv";

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

interface ButtonOwnProps
	extends PressEvents<HTMLButtonElement>,
		FocusableProps<HTMLButtonElement> {}

interface ButtonProps
	extends ButtonOwnProps,
		Omit<
			React.ComponentPropsWithRef<"button">,
			keyof ButtonOwnProps | "onClick"
		> {}

interface ButtonDivOwnProps
	extends PressEvents<HTMLDivElement>,
		FocusableProps<HTMLDivElement> {
	disabled?: boolean;
}

interface ButtonDivProps
	extends ButtonDivOwnProps,
		Omit<React.ComponentPropsWithRef<"div">, keyof ButtonDivOwnProps> {}

export type { ButtonProps, ButtonDivProps };
export { Button, ButtonDiv };
