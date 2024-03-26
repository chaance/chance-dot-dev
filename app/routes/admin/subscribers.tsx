import { Outlet } from "@remix-run/react";
import "./subscribers.css";

export default function AdminSubscribersLayout() {
	return (
		<div className="admin-subscribers-layout">
			<div className="admin-subscribers-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
