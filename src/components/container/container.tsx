import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
	PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { Box, BoxOwnProps } from "src/components/primitives/box";
const styles = require("./container.module.scss");

const CONTAINER_DEFAULT_TAG = "div";

const Container: PolymorphicForwardRefExoticComponent<
	ContainerOwnProps,
	typeof CONTAINER_DEFAULT_TAG
> = React.forwardRef(function ListItem<
	T extends React.ElementType = typeof CONTAINER_DEFAULT_TAG
>(
	{
		as,
		className,
		size,
		...props
	}: PolymorphicPropsWithoutRef<ContainerOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || CONTAINER_DEFAULT_TAG;
	return (
		<Box
			ref={ref}
			as={comp}
			className={[
				styles.container,
				className,
				{
					[styles[`container--${size}`]]: size,
				},
			]}
			{...props}
		/>
	);
});

interface ContainerOwnProps extends BoxOwnProps {
	size?: "wide";
}
type ContainerProps<
	T extends React.ElementType = typeof CONTAINER_DEFAULT_TAG
> = PolymorphicPropsWithRef<ContainerOwnProps, T>;

export { Container };
export type { ContainerOwnProps, ContainerProps };
