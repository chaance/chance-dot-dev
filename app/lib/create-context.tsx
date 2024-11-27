import { createContext as createReactContext } from "react";

export function createContext<T>(
	displayName: string,
	defaultValue: NoChildren<T>,
) {
	let context = createReactContext<NoChildren<T>>(defaultValue);
	context.displayName = displayName;
	return context;
}

type NoChildren<T> = T extends { children: any } ? never : T;
