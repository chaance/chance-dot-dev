import * as React from "react";
import { cx, forwardRef } from "$lib/utils";
import styles from "./box.module.scss";

const defaultElement = "div";

const Box: <Elem extends React.ElementType = typeof defaultElement>(
	props: BoxProps<Elem>
) => React.ReactElement | null = forwardRef(function Box(
	props: BoxOwnProps,
	ref: React.Ref<Element>
) {
	const { as: Comp = defaultElement, ...rest } = props;
	return (
		<Comp ref={ref} {...rest} className={cx(styles.box, props.className)} />
	);
});

type BoxOwnProps<Elem extends React.ElementType = React.ElementType> = {
	as?: Elem;
	className?: import("clsx").ClassValue;
};

type BoxProps<E extends React.ElementType> = BoxOwnProps<E> &
	Omit<React.ComponentProps<E>, keyof BoxOwnProps>;

type PolymorphicComponentProps<Elem extends React.ElementType, Props> = Props &
	BoxProps<Elem>;

type PolymorphicComponent<
	Elem extends React.ElementType = "div",
	Props = {}
> = <E extends React.ElementType = Elem>(
	props: PolymorphicComponentProps<E, Props>
) => React.ReactElement | null;

export type {
	BoxOwnProps,
	BoxProps,
	PolymorphicComponentProps,
	PolymorphicComponent,
};
export { Box };
