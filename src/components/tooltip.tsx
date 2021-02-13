import * as React from "react";
import { cx } from "src/lib/utils";
import {
	Tooltip as ReachTooltip,
	TooltipProps as ReachTooltipProps,
} from "@reach/tooltip";
const styles = require("./tooltip.module.scss");

const Tooltip = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div"> & TooltipOwnProps
>(function Tooltip(props, forwardedRef) {
	return (
		<ReachTooltip
			ref={forwardedRef}
			{...props}
			as="div"
			className={cx(props.className, styles.tooltip)}
		/>
	);
});

type TooltipOwnProps = ReachTooltipProps;

export type { TooltipOwnProps as TooltipProps };
export { Tooltip };
