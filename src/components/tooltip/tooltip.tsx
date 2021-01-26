import * as React from "react";
import { forwardRef, cx } from "$lib/utils";
import {
	Tooltip as ReachTooltip,
	TooltipProps as ReachTooltipProps,
} from "@reach/tooltip";
const styles = require("./tooltip.module.scss");

const Tooltip = forwardRef<"div", TooltipProps>(function Tooltip(
	props,
	forwardedRef
) {
	return (
		<ReachTooltip
			ref={forwardedRef}
			{...props}
			className={cx(props.className, styles.tooltip)}
		/>
	);
});

type TooltipProps = ReachTooltipProps;

export type { TooltipProps };
export { Tooltip };
