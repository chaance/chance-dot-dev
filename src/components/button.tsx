import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
	PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { Box, BoxOwnProps } from "src/components/primitives/box";
const styles = require("./button.module.scss");

const BUTTON_DEFAULT_TAG = "button";

const Button: PolymorphicForwardRefExoticComponent<
	ButtonOwnProps,
	typeof BUTTON_DEFAULT_TAG
> = React.forwardRef(function ListItem<
	T extends React.ElementType = typeof BUTTON_DEFAULT_TAG
>(
	{ as, className, ...props }: PolymorphicPropsWithoutRef<ButtonOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || BUTTON_DEFAULT_TAG;
	return (
		<Box ref={ref} as={comp} className={[styles.button, className]} {...props} />
	);
});

interface ButtonOwnProps extends BoxOwnProps {}
type ButtonProps<
	T extends React.ElementType = typeof BUTTON_DEFAULT_TAG
> = PolymorphicPropsWithRef<ButtonOwnProps, T>;

export { Button };
export type { ButtonOwnProps, ButtonProps };
