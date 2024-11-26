import { useMemo } from "react";
import { useMatches } from "react-router";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param id The route id
 * @returns The router data or undefined if not found
 */
export function useMatchesData(id: string) {
	let matchingRoutes = useMatches();
	let route = useMemo(
		() => matchingRoutes.find((route) => route.id === id),
		[matchingRoutes, id],
	);
	return route?.data;
}
