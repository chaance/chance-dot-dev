import { Outlet } from "@remix-run/react";
import stylesheetUrl from "./mailing-lists.css?url";

export function links() {
	return [{ rel: "stylesheet", href: stylesheetUrl }];
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
