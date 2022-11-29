import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import { requireUserId } from "~/lib/session.server";
import { getBlogPostListItems } from "~/models/blog-post.server";

import routeStylesUrl from "~/dist/styles/routes/admin/blog.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	let userId = await requireUserId(request);
	let blogListItems = await getBlogPostListItems({
		userId,
		select: ["title", "id"],
	});
	return json({ blogListItems });
}

export default function AdminBlogLayout() {
	return (
		<div className="admin-blog-layout">
			<div className="admin-blog-layout-outlet">
				<Outlet />
			</div>
			<footer className="footer">
				<Link
					to="/admin/blog/new"
					className="button button-rounded new-note-button"
					title="New Note"
				>
					<span>+</span>
					<span className="sr-only">New Note</span>
				</Link>
			</footer>
		</div>
	);
}
