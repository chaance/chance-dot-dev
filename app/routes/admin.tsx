import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useMatches } from "@remix-run/react";
import { requireUser } from "~/lib/session.server";
import { useUser } from "~/lib/react/use-user";

import routeStylesUrl from "~/dist/styles/routes/admin.css";
import cx from "clsx";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	requireUser(request, "/login");
	return json(null);
}

export default function AdminBlogLayout() {
	let user = useUser();
	let matches = useMatches();

	let blogRouteMatch = matches.find(
		(match) => match.id === "routes/admin/blog"
	);

	return (
		<div className="admin-layout">
			<div className="container inner">
				<header className="header">
					<Link to=".">
						<h1>Admin</h1>
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

				<div className="main">
					<nav className="nav">
						<ul className="nav-list">
							<li className="nav-item">
								<NavLink
									className={({ isActive }) =>
										cx("nav-item-link", {
											active: isActive,
										})
									}
									to="/admin/blog"
								>
									Blog
								</NavLink>
								{blogRouteMatch?.data?.blogListItems
									? (() => {
											let blogListItems: unknown =
												blogRouteMatch.data.blogListItems;
											if (
												!Array.isArray(blogListItems) ||
												blogListItems.length === 0
											) {
												return null;
											}
											return (
												<ul className="nav-list" data-level="2">
													{blogListItems.map((blogPost) => (
														<li
															key={blogPost.id}
															className="nav-item"
															data-level="2"
														>
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
											);
									  })()
									: null}
							</li>
						</ul>
					</nav>

					<main className="outlet">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}
