import * as React from "react";

export const THEME_LOCAL_STORAGE_KEY: "_chancethedev_theme_key";

type Breakpoints = {
	base: number;
	small: number;
	medium: number;
	large: number;
};

export const breakpoints: Breakpoints;

export function breakpoint(
	bp: keyof Breakpoints | number,
	maxBp?: keyof Breakpoints | number
): string;

export type ThemeContextValue = {
	mode: "dark" | "light";
	toggleMode(): void;
};

export const ThemeContext: React.Context<ThemeContextValue>;

export const ThemeProvider: React.FC;

export function useThemeMode(): "dark" | "light";

export function useThemeModeToggle(): () => void;

export function useBreakpoint(): "base" | "small" | "medium" | "large";

export type Themes = "dark" | "light";

export type Theme = {
	colors: ThemeColorScheme;
};

export type ThemeColorScheme = {
	primary: string;
	background: {
		body: string;
	};
	text: {
		body: string;
	};
};
