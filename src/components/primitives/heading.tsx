import * as React from "react";
import { Box, BoxOwnProps } from "$components/primitives/box";
import { forwardRef } from "$lib/utils";

const LevelContext: React.Context<HeadingLevel> = React.createContext(
	1 as HeadingLevel
);

function useHeadingLevelContext() {
	return React.useContext(LevelContext);
}

const Section = forwardRef<"section", SectionProps>(function Section(
	{ as, wrap = false, children, ...props },
	ref
) {
	const shouldWrap = Boolean(as || wrap);
	const Wrapper = shouldWrap
		? (props: any) => <Box ref={ref} as={as || "section"} {...props} />
		: React.Fragment;

	const level = useHeadingLevelContext();
	return (
		<Wrapper {...(shouldWrap ? props : null)}>
			<LevelContext.Provider
				value={
					React.useMemo(() => Math.min(level + 1, 6), [level]) as HeadingLevel
				}
			>
				{children}
			</LevelContext.Provider>
		</Wrapper>
	);
});

const Heading = forwardRef<"h2", HeadingProps & BoxOwnProps>(
	function Heading({ level: levelProp, ...props }, ref) {
		const level = useHeadingLevelContext();
		const as = `h${levelProp ? levelProp : level}` as "h2";
		return <Box as={as} ref={ref} {...props} />;
	}
);

type HeadingProps = {
	level?: HeadingLevel;
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type SectionProps = {
	wrap?: boolean;
};

export type { SectionProps, HeadingProps };
export { Section, Heading, useHeadingLevelContext };
