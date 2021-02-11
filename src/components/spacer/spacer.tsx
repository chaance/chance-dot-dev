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
		mode = "block",
		spaces = 1,
		medium = {},
		large = {},
		...props
	}: PolymorphicPropsWithoutRef<SpacerOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	let comp: React.ElementType = as || SPACER_DEFAULT_TAG;

	if (mode === "vertical-main") {
		return (
			<Box
				ref={ref}
				as={comp}
				className={[styles.spacer, styles[`spacer--vertical-main`], className]}
				{...props}
			/>
		);
	}

	let mediumMode = medium.mode || mode;
	let largeMode = large.mode || mediumMode;
	let mediumSpaces: string | number = medium.spaces || spaces;
	let largeSpaces: string | number = large.spaces || mediumSpaces;

	let mediumChanged = mediumSpaces !== spaces || mediumMode !== mode;
	let largeChanged = mediumChanged
		? largeSpaces !== mediumSpaces || largeMode !== mediumMode
		: largeSpaces !== spaces || largeMode !== mode;

	let smallSpaces = spaceStr(spaces);
	mediumSpaces = spaceStr(mediumSpaces);
	largeSpaces = spaceStr(largeSpaces);

	return (
		<Box
			ref={ref}
			as={comp}
			className={[
				styles.spacer,
				styles[`spacer--mode-${mode}`],
				styles[`spacer--spaces-${smallSpaces}`],
				className,
				{
					[styles[`spacer--medium-mode-${mediumMode}`]]: mediumChanged,
					[styles[`spacer--medium-spaces-${mediumSpaces}`]]: mediumChanged,
					[styles[`spacer--large-mode-${largeMode}`]]: largeChanged,
					[styles[`spacer--large-spaces-${largeSpaces}`]]: largeChanged,
				},
			]}
			{...props}
		/>
	);
});

interface SpacerBaseProps {
	mode?: SpacerMode;
	spaces?: Spaces;
}

interface SpacerOwnProps extends BoxOwnProps, SpacerBaseProps {
	medium?: SpacerBaseProps;
	large?: SpacerBaseProps;
}

type SpacerProps<
	T extends React.ElementType = typeof SPACER_DEFAULT_TAG
> = PolymorphicPropsWithRef<SpacerOwnProps, T>;

export { Spacer };
export type { SpacerOwnProps, SpacerProps };

type SpacerMode =
	| "inline"
	| "block"
	| "inline-overlap"
	| "block-overlap"
	| "vertical-main";
type Spaces = number;

function spaceStr(spaces: number) {
	return String(spaces).replace(".", "-");
}
