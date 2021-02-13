import * as React from "react";
import {
	Heading as HeadingPrimitive,
	Section,
} from "src/components/primitives/heading";
const styles = require("./heading.module.scss");

function makeHeading(
	which: "heading" | "ht" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
) {
	const H = React.forwardRef<
		HTMLHeadingElement,
		React.ComponentProps<typeof HeadingPrimitive>
	>(function (props, ref) {
		return (
			<HeadingPrimitive
				{...props}
				ref={ref}
				className={[
					props.className,
					styles.heading,
					which !== "heading" && styles[which],
				]}
			/>
		);
	});
	H.displayName = which == "heading" ? "Heading" : which.toUpperCase();
	return H;
}

export const Heading = makeHeading("heading");
export const H1 = makeHeading("h1");
export const HT = makeHeading("ht");
export const H2 = makeHeading("h2");
export const H3 = makeHeading("h3");
export const H4 = makeHeading("h4");
export const H5 = makeHeading("h5");
export const H6 = makeHeading("h6");
export { Section };
