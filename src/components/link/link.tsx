/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import {
	Link as LinkPrim,
	LinkProps as LinkPrimProps,
} from "$components/primitives/link";
import { cx } from "$lib/utils";
const styles = require("./link.module.scss");

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	props,
	ref
) {
	return (
		<LinkPrim
			{...props}
			className={cx(props.className, styles.link)}
			ref={ref}
		/>
	);
});

Link.displayName = "Link";

type LinkProps = Omit<LinkPrimProps, "className"> & {
	className?: import("clsx").ClassValue;
};

export type { LinkProps };
export { Link };
