import * as React from "react";
import { RootContext, defaultContext } from "./root-context";
import type { RootContextData } from "./root-context";

interface RootProviderProps
	extends React.PropsWithChildren<Partial<RootContextData>> {}

export function RootProvider({
	children,
	hydrated = defaultContext.hydrated,
	currentYear = defaultContext.currentYear,
	siteUrl = defaultContext.siteUrl,
}: RootProviderProps) {
	return (
		<RootContext.Provider value={{ hydrated, currentYear, siteUrl }}>
			{children}
		</RootContext.Provider>
	);
}
