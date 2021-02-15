/* eslint-disable quotes */
import * as React from "react";
import { useDarkMode } from "src/lib/use-dark-mode";

const THEME_LOCAL_STORAGE_KEY = "_chancethedev_theme_key";

const ThemeContext = React.createContext<ThemeContextValue>(null!);

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

function useThemeMode() {
	return React.useContext(ThemeContext).mode;
}

function useThemeModeToggle() {
	return React.useContext(ThemeContext).toggleMode;
}

export { ThemeProvider, useThemeMode, useThemeModeToggle };

interface ThemeContextValue {
	mode: "dark" | "light";
	toggleMode(): void;
}

interface ThemeProviderProps {
	forceTheme?: "light" | "dark";
}
