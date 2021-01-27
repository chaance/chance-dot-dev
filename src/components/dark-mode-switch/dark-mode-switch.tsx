import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { useId } from "@reach/auto-id";
import { Tooltip } from "$components/tooltip";
import { ClientOnly } from "$components/primitives/client-only";
import { Switch, SwitchProps } from "$components/switch";
import { useThemeMode, useThemeModeToggle } from "$lib/theme";
import { forwardRef, cx } from "$lib/utils";
import { MoonIcon } from "$components/icons";
const styles = require("./dark-mode-switch.module.scss");

const DarkModeSwitch = forwardRef<"input", DarkModeSwitchProps>(
	function DarkModeSwitch(
		{ label = "Toggle dark mode", ...props },
		forwardedRef
	) {
		const themeMode = useThemeMode();
		const toggleThemeMode = useThemeModeToggle();
		const id = useId(props.id);
		const checked = themeMode === "dark";
		const bleep = React.useRef<HTMLAudioElement | undefined>();

		React.useEffect(() => {
			if (bleep.current === undefined) {
				bleep.current = bleeeeep();
			}
		});

		return (
			<ClientOnly>
				<Tooltip label={label}>
					<Switch
						ref={forwardedRef}
						checked={checked}
						{...props}
						id={id}
						className={cx(props.className, styles.switch)}
						onChange={() => {
							if (bleep.current) {
								if (!bleep.current.paused) {
									bleep.current.pause();
									bleep.current = bleeeeep();
								}
								bleep.current!.play();
							}
							toggleThemeMode();
						}}
					>
						<MoonIcon
							className={cx(styles.icon, checked && styles.iconChecked)}
						/>
					</Switch>
				</Tooltip>
				<label htmlFor={id}>
					<VisuallyHidden>{label}</VisuallyHidden>
				</label>
			</ClientOnly>
		);
	}
);

export { DarkModeSwitch };

function bleeeeep() {
	if (typeof window !== "undefined" && "Audio" in window) {
		return new Audio("/bleep.mp3");
	}
	return undefined;
}

export type DarkModeSwitchProps = Omit<SwitchProps, "onChange" | "id"> & {
	label?: string;
};
