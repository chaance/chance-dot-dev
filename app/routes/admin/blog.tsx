import { Outlet } from "@remix-run/react";
import "~/dist/styles/routes/admin/blog.css";

export function headers() {
	return { "Cache-Control": "max-age=300" };
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
