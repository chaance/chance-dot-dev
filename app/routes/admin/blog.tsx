import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/lib/session.server";
import { useUser } from "~/lib/react/use-user";
import { getBlogPostListItems } from "~/models/blog-post.server";

import routeStylesUrl from "~/dist/styles/routes/admin/blog.css";
import cx from "clsx";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	let userId = await requireUserId(request);
	let noteListItems = await getBlogPostListItems({
		userId,
		select: ["title", "id"],
	});
	return json({ noteListItems });
}

export default function AdminBlogLayout() {
	let data = useLoaderData<typeof loader>();
	let user = useUser();

	return (
		<div className="blog-layout">
			<div className="container inner">
				<header className="header">
					<Link to=".">
						<h1>Blog Posts</h1>
					</Link>
					<Form action="/logout" method="post" className="logout-form">
						<p>
							Logged in as <span className="nobr">{user.email}.</span>
						</p>
						<button type="submit" className="logout-button">
							Log out.
						</button>
					</Form>
				</header>

				<main className="main">
					<div className="posts">
						{data.noteListItems.length === 0 ? (
							<p>No posts yet!</p>
						) : (
							<ol className="posts-list">
								{data.noteListItems.map((note) => (
									<li key={note.id} className="posts-item">
										<NavLink
											className={({ isActive }) =>
												cx("posts-item-link", {
													active: isActive,
												})
											}
											to={note.id}
										>
											<span className="posts-item-icon" aria-hidden>
												📝{" "}
											</span>
											{note.title}
										</NavLink>
									</li>
								))}
							</ol>
						)}
					</div>

					<div className="outlet">
						<Outlet />
					</div>
				</main>

				<footer className="footer">
					<Link
						to="new"
						className="button button-rounded new-note-button"
						title="New Note"
					>
						<span>+</span>
						<span className="sr-only">New Note</span>
					</Link>
				</footer>
			</div>
		</div>
	);
}
