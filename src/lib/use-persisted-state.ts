// https://github.com/donavon/use-persisted-state

import * as React from "react";
import isFunction from "lodash/isFunction";
import { useEventListener } from "@chance/hooks";

function usePersistedState<S>(
	initialState: S | (() => S),
	key: string,
	{ get, set }: CustomStorage
): UseStateReturnType<S> {
	let globalState = React.useRef<GlobalState<S> | null>(null);
	let [state, setState] = React.useState(() => get(key, initialState));

	useEventListener("storage", ({ key: k, newValue }) => {
		if (k === key) {
			const newState = JSON.parse(newValue!);
			if (state !== newState) {
				setState(newState);
			}
		}
	});

	// only called on mount
	React.useEffect(() => {
		// register a listener that calls `setState` when another instance emits
		globalState.current = createGlobalState(key, setState, initialState);
		return () => {
			globalState.current?.deregister();
		};
	}, [initialState, key]);

	const persistentSetState: React.Dispatch<
		React.SetStateAction<S>
	> = React.useCallback(
		(newState) => {
			const newStateValue = isFunction(newState) ? newState(state) : newState;

			// persist to localStorage
			set(key, newStateValue);

			setState(newStateValue);

			// inform all of the other instances in this tab
			globalState.current?.emit(newState);
		},
		[state, set, key]
	);

	return [state, persistentSetState];
}

const globalState: Record<
	string,
	{ callbacks: Array<Function>; value: any }
> = {};

function createGlobalState<S>(
	key: string,
	thisCallback: Function,
	initialValue: S | (() => S)
): GlobalState<S> {
	if (!globalState[key]) {
		globalState[key] = { callbacks: [], value: initialValue };
	}
	globalState[key].callbacks.push(thisCallback);
	return {
		deregister() {
			const arr = globalState[key].callbacks;
			const index = arr.indexOf(thisCallback);
			if (index > -1) {
				arr.splice(index, 1);
			}
		},
		emit(value) {
			if (globalState[key].value !== value) {
				globalState[key].value = value;
				globalState[key].callbacks.forEach((callback) => {
					if (thisCallback !== callback) {
						callback(value);
					}
				});
			}
		},
	};
}

function createStorage(provider: Storage | null): CustomStorage {
	return {
		get(key, defaultValue) {
			const json = provider?.getItem(key) || null;
			return json === null || typeof json === "undefined"
				? isFunction(defaultValue)
					? defaultValue()
					: defaultValue
				: JSON.parse(json);
		},
		set(key, value) {
			provider?.setItem(key, JSON.stringify(value));
		},
	};
}

function getProvider(): Storage | null {
	if (typeof global !== "undefined" && global.localStorage) {
		return global.localStorage;
	}

	if (typeof globalThis !== "undefined" && globalThis.localStorage) {
		return globalThis.localStorage;
	}
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage;
	}
	if (typeof localStorage !== "undefined") {
		return localStorage;
	}
	return null;
}

function createPersistedState<S>(
	key: string,
	provider = getProvider()
): UseState<S> {
	if (provider) {
		const storage = createStorage(provider);
		return function useCustomPersistedState(initialState) {
			return usePersistedState(initialState, key, storage);
		};
	}
	return React.useState;
}

export { usePersistedState, createPersistedState };

interface CustomStorage {
	get(key: string, defaultValue: any): any;
	set(key: string, value: any): void;
}

interface GlobalState<S> {
	deregister(): void;
	emit(value: React.SetStateAction<S>): void;
}

type UseState<S> = (
	initialState: S | (() => S)
) => [S, React.Dispatch<React.SetStateAction<S>>];

type UseStateReturnType<S> = [S, React.Dispatch<React.SetStateAction<S>>];
