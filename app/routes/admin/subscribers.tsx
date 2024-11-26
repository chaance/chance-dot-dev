import { Outlet } from "react-router";

export default function AdminSubscribersLayout() {
	return (
		<div className="admin-subscribers-layout">
			<div className="admin-subscribers-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
