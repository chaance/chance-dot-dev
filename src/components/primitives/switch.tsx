import * as React from "react";
import { cx } from "src/lib/utils";
import isFunction from "lodash/isFunction";
const styles = require("./switch.module.scss");

const SwitchContext = React.createContext({ checked: false });
const useSwitchContext = () => React.useContext(SwitchContext);
SwitchContext.displayName = "SwitchContext";

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{
		"aria-label": ariaLabel,
		checked: checkedProp,
		defaultChecked,
		onChange,
		children,
		...props
	},
	forwardedRef
) {
	const isControlled = checkedProp != null;
	const [_checked, _setChecked] = React.useState(defaultChecked || false);
	const checked = isControlled ? checkedProp! : _checked;
	const setChecked = isControlled ? () => void null : _setChecked;

	const {
		autoComplete,
		autoCorrect,
		autoFocus,
		disabled,
		form,
		id,
		name,
		readOnly,
		required,
		value,
		...wrapperProps
	} = props;

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		onChange && onChange(event);
		if (event.defaultPrevented) {
			return;
		}
		setChecked(event.target.checked);
	}

	return (
		<span {...wrapperProps} className={cx(props.className, styles.wrapper)}>
			<input
				ref={forwardedRef}
				aria-checked={checked}
				aria-label={props["aria-labelledby"] ? undefined : ariaLabel}
				role="switch"
				{...{
					autoComplete,
					autoCorrect,
					autoFocus,
					disabled,
					form,
					id,
					name,
					readOnly,
					required,
					value,
				}}
				data-state={checked ? "on" : "off"}
				checked={checked}
				className={cx(styles.input)}
				onChange={handleChange}
				type="checkbox"
			/>
			<SwitchContext.Provider value={{ checked }}>
				{isFunction(children) ? children({ checked }) : children}
			</SwitchContext.Provider>
		</span>
	);
});

Switch.displayName = "Switch";

export type { SwitchDOMProps, SwitchOwnProps, SwitchProps };
export { Switch, useSwitchContext };

type SwitchDOMProps = React.ComponentPropsWithoutRef<"span"> &
	Pick<React.ComponentPropsWithRef<"input">, InputPropNames | "ref">;
type SwitchOwnProps = {
	checked?: boolean;
	defaultChecked?: boolean;
	children:
		| React.ReactNode
		| ((props: { checked: boolean }) => React.ReactNode);
};
type SwitchProps = SwitchDOMProps & SwitchOwnProps;

type InputPropNames =
	| "autoComplete"
	| "autoCorrect"
	| "autoFocus"
	| "checked"
	| "disabled"
	| "onChange"
	| "form"
	| "id"
	| "name"
	| "readOnly"
	| "required"
	| "value";
