import * as React from "react";

const defaultContext: RootContextData = {
	hydrated: false,
	currentYear: "2024",
	siteUrl: "https://chance.dev",
};

const RootContext = React.createContext<RootContextData>(defaultContext);

interface RootContextData {
	hydrated: boolean;
	currentYear: string;
	siteUrl: string;
}

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

export function useRootContext() {
	return React.useContext(RootContext);
}
