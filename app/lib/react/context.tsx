import * as React from "react";

const RootContext = React.createContext<RootContextData>({
	hydrated: false,
	currentYear: "2024",
});

interface RootContextData {
	hydrated: boolean;
	currentYear: string;
}

interface RootProviderProps extends React.PropsWithChildren<RootContextData> {}

export function RootProvider({
	children,
	hydrated,
	currentYear,
}: RootProviderProps) {
	return (
		<RootContext.Provider value={{ hydrated, currentYear }}>
			{children}
		</RootContext.Provider>
	);
}

export function useRootContext() {
	return React.useContext(RootContext);
}
