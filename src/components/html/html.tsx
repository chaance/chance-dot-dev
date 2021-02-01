import * as React from "react";
import { Box, BoxProps } from "$components/primitives/box";
import { extendComponent } from "$lib/utils";
const styles = require("./html.module.scss");

const Abbr = html("abbr");
const Blockquote = html("blockquote");
const Cite = html("cite");
const P = html("p");
const Legend = html("legend");

function html<Tag extends keyof JSX.IntrinsicElements>(tag: Tag) {
	tag = tag.toLowerCase() as Tag;
	return extendComponent(tag, {
		displayName: ucFirst(tag),
		className: styles[tag],
	});
}

function ucFirst(str: string) {
	return typeof str === "string"
		? str.charAt(0).toUpperCase() + str.slice(1)
		: "";
}

const Hr = React.forwardRef<HTMLHRElement, HrOwnProps & BoxProps<"hr">>(
	function ({ lineStyle = "basic", lineThickness = 1, ...props }, ref) {
		return (
			<Box
				as="hr"
				ref={ref}
				{...props}
				className={[props.className, styles.hr, styles[lineStyle]]}
				data-thickness={lineThickness}
			/>
		);
	}
);
Hr.displayName = "Hr";

interface HrOwnProps {
	lineStyle?: "basic" | "gradient";
	lineThickness?: 1 | 2 | 3;
}

export { Abbr, Blockquote, Cite, P, Hr, Legend };
