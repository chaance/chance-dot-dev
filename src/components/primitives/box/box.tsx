import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
	PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { cx } from "$lib/utils";
import styles from "./box.module.scss";

const BOX_DEFAULT_ELEMENT = "div";

interface BoxOwnProps {
	className?: import("clsx").ClassValue;
}

const Box: PolymorphicForwardRefExoticComponent<
	BoxOwnProps,
	typeof BOX_DEFAULT_ELEMENT
> = React.forwardRef(
	<T extends React.ElementType = typeof BOX_DEFAULT_ELEMENT>(
		{ as, className, ...props }: PolymorphicPropsWithoutRef<BoxOwnProps, T>,
		ref: React.ForwardedRef<React.ElementRef<T>>
	) => {
		const Comp: React.ElementType = as || BOX_DEFAULT_ELEMENT;
		return <Comp ref={ref} {...props} className={cx(styles.box, className)} />;
	}
);

type BoxProps<
	T extends React.ElementType = typeof BOX_DEFAULT_ELEMENT
> = PolymorphicPropsWithRef<BoxOwnProps, T>;

export type { BoxProps, BoxOwnProps };
export { Box };
