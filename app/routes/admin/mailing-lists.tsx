import { Outlet } from "@remix-run/react";
import "./mailing-lists.css";

export default function AdminMailingListsLayout() {
	return (
		<div className="admin-mailing-lists-layout">
			<div className="admin-mailing-lists-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
