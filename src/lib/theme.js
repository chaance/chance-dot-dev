/* eslint-disable quotes */
import * as React from "react";
import useDarkMode from "use-dark-mode";

const THEME_LOCAL_STORAGE_KEY = "_chancethedev_theme_key";

const BREAKPOINTS = {
	base: 0,
	small: 330,
	medium: 600,
	large: 1100,
};

function breakpoint(bp, maxBp) {
	let bpVal = typeof bp === "number" ? bp : BREAKPOINTS[bp];
	let maxBpVal = maxBp
		? typeof maxBp === "number"
			? maxBp
			: BREAKPOINTS[maxBp] - 1
		: undefined;

	if (maxBpVal && maxBpVal <= bpVal) {
		maxBpVal = undefined;
	}

	if (bpVal === 0) return "";
	let bpStr = `@media screen and (min-width: ${bpVal}px)`;
	if (maxBpVal) {
		bpStr += ` and (max-width: ${maxBpVal}px)`;
	}
	return bpStr;
}

export const ThemeContext = React.createContext(null);

const ThemeProviderImpl = ({ children }) => {
	let { value, toggle } = useDarkMode(false, {
		storageKey: THEME_LOCAL_STORAGE_KEY,
	});
	return (
		<ThemeContext.Provider
			value={{ mode: value ? "dark" : "light", toggleMode: toggle }}
		>
			{children}
		</ThemeContext.Provider>
	);
};

const ThemeProviderInner = React.memo(({ children }) => (
	<React.Fragment>{children}</React.Fragment>
));

const ThemeProvider = ({ children }) => (
	<ThemeProviderImpl>
		<ThemeProviderInner>{children}</ThemeProviderInner>
	</ThemeProviderImpl>
);

export function useThemeMode() {
	return React.useContext(ThemeContext).mode;
}

export function useThemeModeToggle() {
	return React.useContext(ThemeContext).toggleMode;
}

export function useBreakpoint() {
	let [breakpoint, setBreakpoint] = React.useState(null);

	React.useEffect(() => {
		let mounted = true;
		let queries = new Set();

		Object.keys(BREAKPOINTS).forEach((bp, index, src) => {
			let nextBp =
				index === src.length - 1 ? null : BREAKPOINTS[src[index + 1]];
			let maxScreenSize = nextBp && nextBp - 1;
			let minScreenSize = index ? BREAKPOINTS[bp] : null;
			let query = [
				minScreenSize && `(min-width: ${minScreenSize}px)`,
				maxScreenSize && `(max-width: ${maxScreenSize}px)`,
			]
				.filter(Boolean)
				.join(" and ");
			let queryList = window.matchMedia(query);
			queryList.addListener(listener);
			queries.add({ queryList, listener });

			if (queryList.matches) {
				setBreakpoint(bp);
			}

			function listener(event) {
				if (!mounted) return;
				if (event.matches) {
					setBreakpoint(bp);
				}
			}
		});

		return () => {
			mounted = false;
			queries.forEach((query) =>
				query.queryList.removeListener(query.listener)
			);
		};
	}, []);

	return breakpoint;
}

export {
	THEME_LOCAL_STORAGE_KEY,
	BREAKPOINTS as breakpoints,
	breakpoint,
	ThemeProvider,
};
