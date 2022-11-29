import { Outlet, type ShouldReloadFunction } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import { requireUser } from "~/lib/session.server";

import routeStylesUrl from "~/dist/styles/routes/admin.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

export async function loader({ request }: LoaderArgs) {
	requireUser(request, "/login");
	return json(null);
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	return (
		!!submission &&
		["/login", "/logout"].some((pathname) =>
			submission.action.startsWith(pathname)
		)
	);
};

export default function AdminLayout() {
	return <Outlet />;
}
