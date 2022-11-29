import { useMemo } from "react";
import { useMatches } from "@remix-run/react";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
	id: string
): Record<string, unknown> | undefined {
	let matchingRoutes = useMatches();
	let route = useMemo(
		() => matchingRoutes.find((route) => route.id === id),
		[matchingRoutes, id]
	);
	return route?.data;
}
