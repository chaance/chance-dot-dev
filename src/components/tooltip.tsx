import * as React from "react";
import { cx } from "src/lib/utils";
import {
	Tooltip as ReachTooltip,
	TooltipProps as ReachTooltipProps,
} from "@reach/tooltip";
import VisuallyHidden from "@reach/visually-hidden";
const styles = require("./tooltip.module.scss");

const Tooltip = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div"> & TooltipOwnProps
>(function Tooltip(props, forwardedRef) {
	let trickTheComputer = useGoofyCssTrick();

	return (
		<React.Fragment>
			<ReachTooltip
				ref={forwardedRef}
				{...props}
				as="div"
				className={cx(props.className, styles.tooltip)}
			/>
			{trickTheComputer && <FakerTooltip {...props} />}
		</React.Fragment>
	);
});

type TooltipOwnProps = ReachTooltipProps;

export type { TooltipOwnProps as TooltipProps };
export { Tooltip };

// Ok so for future me, here's what's happening. Tooltip rendering is delayed
// until the user interacts with its trigger. I haven't investigated too deeply,
// but I think the css module loading is also delayed, meaning the very first
// time a user tries to interact with a tooltip there is a flash on unstyled
// content and the tooltip looks all janky. I don't want to server render any
// bogus trickery so I do a couple of useEffects when Tooltip is rendered the
// very first time to quickly render a visually hidden div that loads the styles
// so that when the tooltip shows up it's very pretty as the styles dictate it
// should be. I'm sure someone has solved this better somewhere but I'm too lazy
// to look.
let rendered = false;
function useGoofyCssTrick() {
	let [trick, setTrick] = React.useState(false);

	React.useEffect(() => {
		if (!rendered) {
			rendered = true;
			setTrick(true);
		}
	}, []);

	React.useEffect(() => {
		if (trick) {
			setTrick(false);
		}
	}, [trick]);

	return trick;
}

function FakerTooltip(props: any) {
	return (
		<VisuallyHidden>
			<div className={cx(props.className, styles.tooltip)}>{props.label}</div>
		</VisuallyHidden>
	);
}
