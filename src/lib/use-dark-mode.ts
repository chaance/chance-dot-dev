// https://github.com/donavon/use-dark-mode

import * as React from "react";
import { useEventListener } from "@chance/hooks";
import { createPersistedState } from "src/lib/use-persisted-state";

function useDarkMode(
	initialValue: boolean = false,
	{
		element,
		classNameDark,
		classNameLight,
		onChange,
		storageKey = "darkMode",
		storageProvider,
		global,
	}: DarkModeConfig = {}
) {
	const {
		usePersistedDarkModeState,
		getDefaultOnChange,
		getInitialValue,
		mediaQueryEventTarget,
	} = React.useMemo(() => initialize(storageKey, storageProvider, global), [
		storageKey,
		storageProvider,
		global,
	]);

	const [state, setState] = usePersistedDarkModeState(
		getInitialValue(initialValue)
	);

	const stateChangeCallback = React.useMemo(
		() =>
			onChange || getDefaultOnChange(element, classNameDark, classNameLight),
		[onChange, element, classNameDark, classNameLight, getDefaultOnChange]
	);

	// Call the onChange handler
	React.useEffect(() => {
		stateChangeCallback(state);
	}, [stateChangeCallback, state]);

	// Listen for media changes and set state.
	useEventListener(
		"change",
		({ matches }: any) => setState(matches),
		mediaQueryEventTarget as HTMLElement
	);

	return {
		value: state,
		enable: React.useCallback(() => setState(true), [setState]),
		disable: React.useCallback(() => setState(false), [setState]),
		toggle: React.useCallback(() => setState((current) => !current), [
			setState,
		]),
	};
}

function noop() {}

const mockElement = {
	classList: {
		add: noop,
		remove: noop,
	},
};

const preferDarkQuery = "(prefers-color-scheme: dark)";

function initialize(
	storageKey: string,
	storageProvider: Storage | null | undefined,
	glbl: Window | typeof globalThis | (Window & typeof globalThis) = global
) {
	const usePersistedDarkModeState: UseState<boolean> = storageKey
		? createPersistedState(storageKey, storageProvider)
		: React.useState;

	const mql: MediaQueryList | null = glbl.matchMedia
		? glbl.matchMedia(preferDarkQuery)
		: null;

	const mediaQueryEventTarget = {
		addEventListener(_: any, handler: MediaQueryEventListener) {
			if (!mql) return;

			if ("addEventListener" in mql) {
				return mql.addEventListener("change", handler);
			} else if ("addListener" in mql) {
				// @ts-ignore
				return mql.addListener(handler);
			}
		},
		removeEventListener(_: any, handler: MediaQueryEventListener) {
			if (!mql) return;

			if ("removeEventListener" in mql) {
				return mql.removeEventListener("change", handler);
			} else if ("removeListener" in mql) {
				// @ts-ignore
				return mql.removeListener(handler);
			}
		},
	};

	const isColorSchemeQuerySupported = mql
		? mql.media === preferDarkQuery
		: false;

	function getInitialValue(usersInitialState: boolean) {
		return isColorSchemeQuerySupported ? mql!.matches : usersInitialState;
	}

	// Mock element if SSR, else real body element.
	const defaultElement: HTMLElement =
		(glbl.document && glbl.document.body) || mockElement;

	function getDefaultOnChange(
		element = defaultElement,
		classNameDark = "dark-mode",
		classNameLight = "light-mode"
	) {
		return function onChange(val: boolean) {
			element.classList.add(val ? classNameDark : classNameLight);
			element.classList.remove(val ? classNameLight : classNameDark);
		};
	}

	return {
		usePersistedDarkModeState,
		getDefaultOnChange,
		mediaQueryEventTarget,
		getInitialValue,
	};
}

interface DarkModeConfig {
	classNameDark?: string; // A className to set "dark mode". Default = "dark-mode".
	classNameLight?: string; // A className to set "light mode". Default = "light-mode".
	element?: HTMLElement; // The element to apply the className. Default = `document.body`
	onChange?(val?: boolean): void; // Overide the default className handler with a custom callback.
	storageKey?: string; // Specify the `localStorage` key. Default = "darkMode". Set to `null` to disable persistent storage.
	storageProvider?: Storage; // A storage provider. Default = `localStorage`.
	global?: Window & typeof globalThis; // The global object. Default = `window`.
}

interface DarkMode {
	readonly value: boolean;
	enable(): void;
	disable(): void;
	toggle(): void;
}

type MediaQueryEventListener = (
	this: MediaQueryList,
	ev: MediaQueryListEvent
) => any;

export { useDarkMode };
export type { DarkMode };

type UseState<S> = (
	initialState: S | (() => S)
) => [S, React.Dispatch<React.SetStateAction<S>>];
