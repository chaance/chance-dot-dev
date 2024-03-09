import type { LinksFunction } from "@remix-run/node";

import routeStylesUrl from "~/dist/styles/routes/admin/mailing-lists.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export function headers() {
	return { "Cache-Control": "max-age=300" };
}

export default function AdminMailingListsLayout() {
	return (
		<div className="admin-mailing-lists-layout">
			<div className="admin-mailing-lists-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
