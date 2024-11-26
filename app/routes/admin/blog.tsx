import { Outlet } from "react-router";
import "./blog.css";

export default function AdminBlogLayout() {
	return (
		<div className="admin-blog-layout">
			<div className="admin-blog-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
