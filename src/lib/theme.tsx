/* eslint-disable quotes */
import * as React from "react";
import useDarkMode from "use-dark-mode";

const THEME_LOCAL_STORAGE_KEY = "_chancethedev_theme_key";

const BREAKPOINTS: Breakpoints = {
	base: 0,
	small: 330,
	medium: 600,
	large: 1100,
};

function breakpoint(
	bp: keyof Breakpoints | number,
	maxBp?: keyof Breakpoints | number
): string {
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

export const ThemeContext = React.createContext<ThemeContextValue>(null!);

const ThemeProviderImpl: React.FC<ThemeProviderProps> = ({
	children,
	forceTheme: forceMode,
}) => {
	let { value, toggle } = useDarkMode(false, {
		storageKey: THEME_LOCAL_STORAGE_KEY,
	});
	return (
		<ThemeContext.Provider
			value={{
				mode: forceMode || value ? "dark" : "light",
				toggleMode: toggle,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

const ThemeProviderInner = React.memo(({ children }) => (
	<React.Fragment>{children}</React.Fragment>
));

const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	...props
}) => (
	<ThemeProviderImpl {...props}>
		<ThemeProviderInner>{children}</ThemeProviderInner>
	</ThemeProviderImpl>
);

export function useThemeMode() {
	return React.useContext(ThemeContext).mode;
}

export function useThemeModeToggle() {
	return React.useContext(ThemeContext).toggleMode;
}

export function useBreakpoint(): null | keyof Breakpoints {
	let [breakpoint, setBreakpoint] = React.useState<keyof Breakpoints | null>(
		null
	);

	React.useEffect(() => {
		let mounted = true;
		let queries = new Set<{
			queryList: MediaQueryList;
			listener: (event: MediaQueryListEvent) => void;
		}>();

		Object.keys(BREAKPOINTS).forEach((_bp, index, src) => {
			let currBpKey = _bp as keyof Breakpoints;
			let nextBpKey = src[index + 1] as keyof Breakpoints;
			let nextBp = index === src.length - 1 ? null : BREAKPOINTS[nextBpKey];
			let maxScreenSize = nextBp && nextBp - 1;
			let minScreenSize = index ? BREAKPOINTS[currBpKey] : null;
			let query = [
				minScreenSize && `(min-width: ${minScreenSize}px)`,
				maxScreenSize && `(max-width: ${maxScreenSize}px)`,
			]
				.filter(Boolean)
				.join(" and ");
			let queryList = window.matchMedia(query);
			queryList.addEventListener("change", listener);
			queries.add({ queryList, listener });

			if (queryList.matches) {
				setBreakpoint(currBpKey);
			}

			function listener(event: MediaQueryListEvent): void {
				if (!mounted) return;
				if (event.matches) {
					setBreakpoint(currBpKey);
				}
			}
		});

		return () => {
			mounted = false;
			queries.forEach((query) =>
				query.queryList.removeEventListener("change", query.listener)
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

interface Breakpoints {
	base: number;
	small: number;
	medium: number;
	large: number;
}

interface ThemeContextValue {
	mode: "dark" | "light";
	toggleMode(): void;
}

interface ThemeProviderProps {
	forceTheme?: "light" | "dark";
}
