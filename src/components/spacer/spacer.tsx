import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
	PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { Box, BoxOwnProps } from "$components/primitives/box";
const styles = require("./spacer.module.scss");

const SPACER_DEFAULT_TAG = "div";

const Spacer: PolymorphicForwardRefExoticComponent<
	SpacerOwnProps,
	typeof SPACER_DEFAULT_TAG
> = React.forwardRef(function ListItem<
	T extends React.ElementType = typeof SPACER_DEFAULT_TAG
>(
	{
		as,
		className,
		direction = "block",
		spaces = 1,
		collapse = "collapse",
		medium = {},
		large = {},
		preset,
		...props
	}: PolymorphicPropsWithoutRef<SpacerOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	let comp: React.ElementType = as || SPACER_DEFAULT_TAG;
	let baseStyles = [styles.spacer, className];

	if (preset === "vertical-main") {
		return (
			<Box
				ref={ref}
				as={comp}
				className={[...baseStyles, styles[`spacer--vertical-main`]]}
				{...props}
			/>
		);
	}

	let mediumMode = medium.direction || direction;
	let largeMode = large.direction || mediumMode;
	let mediumSpaces: string | number = medium.spaces || spaces;
	let largeSpaces: string | number = large.spaces || mediumSpaces;
	let mediumCollapse = medium.collapse || collapse;
	let largeCollapse = large.collapse || mediumCollapse;

	let mediumChanged =
		mediumSpaces !== spaces ||
		mediumMode !== direction ||
		mediumCollapse !== collapse;

	let largeChanged = mediumChanged
		? largeSpaces !== mediumSpaces ||
		  largeMode !== mediumMode ||
		  largeCollapse !== mediumCollapse
		: largeSpaces !== spaces ||
		  largeMode !== direction ||
		  largeCollapse !== collapse;

	let smallSpaces = spaceStr(spaces);
	mediumSpaces = spaceStr(mediumSpaces);
	largeSpaces = spaceStr(largeSpaces);

	return (
		<Box
			ref={ref}
			as={comp}
			className={[
				...baseStyles,
				styles[`spacer--direction-${direction}`],
				styles[`spacer--collapse-${collapse}`],
				styles[`spacer--spaces-${smallSpaces}`],
				{
					[styles[`spacer--medium-direction-${mediumMode}`]]: mediumChanged,
					[styles[`spacer--medium-collapse-${mediumCollapse}`]]: mediumChanged,
					[styles[`spacer--medium-spaces-${mediumSpaces}`]]: mediumChanged,
					[styles[`spacer--large-direction-${largeMode}`]]: largeChanged,
					[styles[`spacer--large-collapse-${largeCollapse}`]]: largeChanged,
					[styles[`spacer--large-spaces-${largeSpaces}`]]: largeChanged,
				},
			]}
			{...props}
		/>
	);
});

interface SpacerBaseProps {
	collapse?: SpacerCollapse;
	direction?: SpacerDirection;
	spaces?: Spaces;
}

interface SpacerOwnProps extends BoxOwnProps, SpacerBaseProps {
	preset?: SpacerPreset;
	medium?: SpacerBaseProps;
	large?: SpacerBaseProps;
}

type SpacerProps<
	T extends React.ElementType = typeof SPACER_DEFAULT_TAG
> = PolymorphicPropsWithRef<SpacerOwnProps, T>;

export { Spacer };
export type { SpacerOwnProps, SpacerProps };

type SpacerCollapse = "collapse" | "separate";
type SpacerPreset = "vertical-main";
type SpacerDirection = "inline" | "block";

type Spaces = number;

function spaceStr(spaces: number) {
	return String(spaces).replace(".", "-");
}
