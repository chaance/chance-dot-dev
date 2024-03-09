import { Outlet } from "@remix-run/react";
import "./subscribers.css";

export function headers() {
	return { "Cache-Control": "max-age=300" };
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
