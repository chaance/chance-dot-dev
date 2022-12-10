import { isUser } from "~/lib/utils";
import { useMatchesData } from "~/lib/react/use-matches-data";

/**
 * @param routeId The route ID from which the user is loaded.
 */
export function useOptionalUser(routeId: string) {
	let data = useMatchesData(routeId);
	if (data && typeof data === "object" && "user" in data && isUser(data.user)) {
		return data.user;
	}
	return null;
}

/**
 * @param routeId The route ID from which the user is loaded.
 */
export function useRequiredUser(routeId: string) {
	let user = useOptionalUser(routeId);
	if (!user) {
		throw new Error(
			`No user returned from the loader at \`${routeId}\`. If user is optional, try \`useOptionalUser\` instead.`
		);
	}
	return user;
}
