import * as React from "react";
import { createContext } from "~/lib/react/create-context";

export const HeadingLevelContext = createContext<HeadingLevel>(
	"HeadingLevelContext",
	1,
);

export function useHeadingLevelContext() {
	return React.useContext(HeadingLevelContext);
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
