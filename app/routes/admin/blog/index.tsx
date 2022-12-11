import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	NavLink,
	type ShouldReloadFunction,
	useLoaderData,
} from "@remix-run/react";
import cx from "clsx";
import { requireUserId } from "~/lib/session.server";
import { getBlogPostListItems } from "~/models/blog-post.server";

export async function loader({ request }: LoaderArgs) {
	let userId = await requireUserId(request);
	let blogListItems = await getBlogPostListItems({
		userId,
		select: ["title", "id"],
	});
	return json({ blogListItems });
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	return !!submission && submission.method.toLowerCase() !== "get";
};

export default function AdminBlogIndex() {
	let { blogListItems } = useLoaderData<typeof loader>();
	return (
		<div className="note-index">
			{blogListItems.length < 1 ? (
				<p>
					No note selected. Select a note on the left, or{" "}
					<Link
						to="new"
						style={{
							textDecoration: "underline",
						}}
					>
						create a new note.
					</Link>
				</p>
			) : (
				<ul>
					{blogListItems.map((blogPost) => (
						<li key={blogPost.id} className="nav-item" data-level="2">
							<NavLink
								data-level="2"
								className={({ isActive }) =>
									cx("nav-item-link", {
										active: isActive,
									})
								}
								to={`/admin/blog/${blogPost.id}`}
							>
								{blogPost.title}
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
