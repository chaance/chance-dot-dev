import * as React from "react";
// import { useFocusRing } from "@react-aria/focus";
// import { useFocusWithin } from "@react-aria/interactions";
import {
	Switch as SwitchPrim,
	SwitchProps as SwitchPrimProps,
	useSwitchContext,
} from "src/components/primitives/switch";
import { cx } from "src/lib/utils";
const styles = require("./switch.module.scss");

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{ children, ...props },
	forwardedRef
) {
	return (
		<SwitchPrim
			ref={forwardedRef}
			{...props}
			className={cx(props.className, styles.switch)}
		>
			{({ checked }) => (
				<span className={cx(styles.thumb, checked && styles.checked)}>
					<span className={cx(styles.focusRing)}></span>
					<span className={styles.inner}>{children}</span>
				</span>
			)}
		</SwitchPrim>
	);
});

type SwitchProps = SwitchPrimProps;

export type { SwitchProps };
export { Switch, useSwitchContext };
