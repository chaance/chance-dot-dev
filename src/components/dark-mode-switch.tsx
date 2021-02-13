import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { useId } from "@reach/auto-id";
import { Tooltip } from "src/components/tooltip";
import { ClientOnly } from "src/components/primitives/client-only";
import { Switch, SwitchProps } from "src/components/switch";
import { useThemeMode, useThemeModeToggle } from "src/lib/theme";
import { cx } from "src/lib/utils";
import { makeIconComponent } from "src/components/icons";
import { useAudio } from "src/lib/use-audio";
const styles = require("./dark-mode-switch.module.scss");

const DarkModeSwitch = React.forwardRef<HTMLInputElement, DarkModeSwitchProps>(
	function DarkModeSwitch(
		{ label = "Toggle dark mode", ...props },
		forwardedRef
	) {
		const themeMode = useThemeMode();
		const toggleThemeMode = useThemeModeToggle();
		const id = useId(props.id);
		const checked = themeMode === "dark";
		const bleep = useAudio("/bleep.mp3");

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
							bleep.play({ interrupt: true });
							toggleThemeMode();
						}}
					>
						<span
							className={cx(styles.iconWrapper, {
								[styles.iconWrapperChecked]: checked,
							})}
						>
							{checked ? (
								<DarkIcon className={styles.icon} />
							) : (
								<LightIcon className={styles.icon} />
							)}
						</span>
						{/* <MoonIcon
							className={cx(styles.icon, checked && styles.iconChecked)}
						/> */}
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

export type DarkModeSwitchProps = Omit<SwitchProps, "onChange" | "children"> & {
	label?: string;
};

const LIGHTGRAY = "var(--color-static-gray-30)";
const DARKGRAY = "var(--color-static-gray-60)";
const BLACK = "var(--color-static-gray-100)";
const YELLOW = "var(--color-static-yellow-30)";
const ORANGE = "var(--color-static-orange-40)";

const LightIcon = makeIconComponent(
	{
		size: 20,
		title: "Light theme character",
		displayName: "LightIcon",
		viewBox: "0 0 136 136",
	},
	<>
		<defs>
			<radialGradient
				id="ad7af374-30b2-4a50-94fa-201160a4a604"
				cx="54.7002"
				cy="59.6947"
				r="90.1215"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0" stopColor={YELLOW} />
				<stop offset="1" stopColor={ORANGE} />
			</radialGradient>
		</defs>
		<circle
			cx="68"
			cy="68"
			r="68"
			fill="url(#ad7af374-30b2-4a50-94fa-201160a4a604)"
		/>
		<circle cx="33.2737" cy="38.6311" r="5.7411" fill={BLACK} />
		<circle cx="69.0802" cy="38.6311" r="5.7411" fill={BLACK} />
		<path
			d="M51.1772,78.8525c-10.038,0-17.6914-3.7754-22.1337-10.9179a4.5,4.5,0,1,1,7.6425-4.753c2.7915,4.4888,7.5318,6.6709,14.4912,6.6709S62.8765,67.67,65.668,63.1816a4.5,4.5,0,1,1,7.6425,4.753C68.8682,75.0771,61.2148,78.8525,51.1772,78.8525Z"
			fill={BLACK}
		/>
	</>
);

const DarkIcon = makeIconComponent(
	{
		size: 20,
		title: "Dark theme character",
		displayName: "DarkIcon",
		viewBox: "0 0 136 136",
	},
	<>
		<defs>
			<radialGradient
				id="e50ed4ad-ecc3-47b8-9595-45ab5b9e4f94"
				cx="-58.1476"
				cy="59.6947"
				r="90.1215"
				gradientTransform="matrix(-1, 0, 0, 1, 23.1522, 0)"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0" stopColor={LIGHTGRAY} />
				<stop offset="1" stopColor={DARKGRAY} />
			</radialGradient>
		</defs>
		<circle
			cx="68"
			cy="68"
			r="68"
			fill="url(#e50ed4ad-ecc3-47b8-9595-45ab5b9e4f94)"
		/>
		<circle cx="102.7263" cy="58.6311" r="5.7411" fill={BLACK} />
		<circle cx="66.9198" cy="58.6311" r="5.7411" fill={BLACK} />
		<path
			d="M84.8231,98.853c-10.0371,0-17.6909-3.7754-22.1338-10.9184a4.5,4.5,0,1,1,7.6426-4.753c2.792,4.4893,7.5322,6.6714,14.4912,6.6714s11.6992-2.1821,14.4912-6.6714a4.5,4.5,0,0,1,7.6426,4.753C102.514,95.0776,94.86,98.853,84.8231,98.853Z"
			fill={BLACK}
		/>
	</>
);
