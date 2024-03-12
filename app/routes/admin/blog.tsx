import { Outlet } from "@remix-run/react";
import stylesheetUrl from "./blog.css?url";

export function links() {
	return [{ rel: "stylesheet", href: stylesheetUrl }];
}

export default function AdminBlogLayout() {
	return (
		<div className="admin-blog-layout">
			<div className="admin-blog-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
