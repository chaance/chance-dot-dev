import { Outlet } from "@remix-run/react";
import stylesheetUrl from "./subscribers.css?url";

export function links() {
	return [{ rel: "stylesheet", href: stylesheetUrl }];
}

export default function AdminSubscribersLayout() {
	return (
		<div className="admin-subscribers-layout">
			<div className="admin-subscribers-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
