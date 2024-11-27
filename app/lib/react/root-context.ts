import * as React from "react";
import { createContext } from "./create-context";

export interface RootContextData {
	hydrated: boolean;
	currentYear: string;
	siteUrl: string;
}

export const defaultContext: RootContextData = {
	hydrated: false,
	currentYear: "2024",
	siteUrl: "https://chance.dev",
};

export const RootContext = createContext<RootContextData>(
	"RootContext",
	defaultContext,
);

export function useRootContext() {
	return React.useContext(RootContext);
}
