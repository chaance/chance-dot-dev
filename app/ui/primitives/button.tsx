import * as React from "react";
import { useButton } from "@react-aria/button";
import type { PressEvents, FocusableProps } from "~/types/react-aria";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, forwardedRef) => {
		let ref = React.useRef<HTMLButtonElement>(null);
		let { buttonProps } = useButton(
			{
				...(props as any),
				excludeFromTabOrder: props.tabIndex != null && props.tabIndex !== 0,
				isDisabled: props.disabled,
			},
			ref
		);
		return (
			<button ref={forwardedRef} {...props} {...buttonProps}>
				{children}
			</button>
		);
	}
);
Button.displayName = "Button";

const ButtonDiv = React.forwardRef<HTMLDivElement, ButtonDivProps>(
	({ children, ...props }, forwardedRef) => {
		let ref = React.useRef<HTMLDivElement>(null);
		let { buttonProps } = useButton(
			{
				...(props as any),
				elementType: "div",
				excludeFromTabOrder: props.tabIndex != null && props.tabIndex !== 0,
				isDisabled: props.disabled,
			},
			ref
		);
		return (
			<div ref={forwardedRef} {...props} {...buttonProps}>
				{children}
			</div>
		);
	}
);
ButtonDiv.displayName = "ButtonDiv";

interface ButtonOwnProps
	extends PressEvents<HTMLButtonElement>,
		FocusableProps<HTMLButtonElement> {}

interface ButtonProps
	extends ButtonOwnProps,
		Omit<React.ComponentPropsWithRef<"button">, keyof ButtonOwnProps> {}

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
