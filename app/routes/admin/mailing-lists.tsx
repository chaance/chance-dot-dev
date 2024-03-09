import { Outlet } from "@remix-run/react";
import "~/dist/styles/routes/admin/mailing-lists.css";

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
