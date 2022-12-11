import type { LinksFunction } from "@remix-run/node";
import { Outlet, type ShouldReloadFunction } from "@remix-run/react";

import routeStylesUrl from "~/dist/styles/routes/admin/blog.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export function headers() {
	return { "Cache-Control": "max-age=300" };
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	return !!submission && submission.method.toLowerCase() !== "get";
};

export default function AdminBlogLayout() {
	return (
		<div className="admin-blog-layout">
			<div className="admin-blog-layout-outlet">
				<Outlet />
			</div>
		</div>
	);
}
