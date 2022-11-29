import { isUser } from "~/lib/utils";
import { useMatchesData } from "~/lib/react/use-matches-data";

export function useOptionalUser() {
	let data = useMatchesData("root");
	if (!data || !isUser(data.user)) {
		return null;
	}
	return data.user;
}

export function useUser() {
	let maybeUser = useOptionalUser();
	if (!maybeUser) {
		throw new Error(
			"No user found in the root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
		);
	}
	return maybeUser;
}
