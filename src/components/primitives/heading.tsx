import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";
import { Box, BoxOwnProps } from "src/components/primitives/box";

const LevelContext: React.Context<HeadingLevel> = React.createContext(
	1 as HeadingLevel
);

function useHeadingLevelContext() {
	return React.useContext(LevelContext);
}

const Section: PolymorphicForwardRefExoticComponent<
	SectionOwnProps,
	"section"
> = React.forwardRef(function Section<T extends React.ElementType = "section">(
	{ as, wrap = false, children, ...props }: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const shouldWrap = Boolean(as || wrap);
	const Wrapper = shouldWrap ? SectionWrapper : React.Fragment;
	const level = useHeadingLevelContext();
	const ctx = React.useMemo(() => Math.min(level + 1, 6), [
		level,
	]) as HeadingLevel;

	return (
		<Wrapper {...(shouldWrap ? ({ ref, as, ...props } as any) : null)}>
			<LevelContext.Provider value={ctx}>{children}</LevelContext.Provider>
		</Wrapper>
	);
});

const SectionWrapper: PolymorphicForwardRefExoticComponent<
	{},
	"section"
> = React.forwardRef(function SectionWrapper<
	T extends React.ElementType = "section"
>(
	{ as, ...props }: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || "section";
	return <Box ref={ref} as={comp} {...props} />;
});

const Heading: PolymorphicForwardRefExoticComponent<
	HeadingOwnProps,
	"h2"
> = React.forwardRef(function Heading<T extends React.ElementType = "h2">(
	{
		as,
		level: levelProp,
		...props
	}: PolymorphicPropsWithoutRef<HeadingOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const level = useHeadingLevelContext();
	const comp: React.ElementType =
		as || (`h${levelProp ? levelProp : level}` as "h2");

	return <Box ref={ref} as={comp} {...props} data-level={level} />;
});

interface HeadingOwnProps extends BoxOwnProps {
	level?: HeadingLevel;
}

interface SectionOwnProps extends BoxOwnProps {
	wrap?: boolean;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type { SectionOwnProps, HeadingOwnProps };
export { Section, Heading, useHeadingLevelContext };
