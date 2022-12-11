import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
	Form,
	Link,
	Outlet,
	useLoaderData,
	useMatches,
	type RouteMatch,
} from "@remix-run/react";
import { requireUser } from "~/lib/session.server";

import routeStylesUrl from "~/dist/styles/routes/admin.css";
import cx from "clsx";
import { AdminHeader } from "./admin/ui/admin-header";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	let user = await requireUser(request, "/login");
	return json({ user });
}

interface NavItem {
	key: string;
	label: string;
	to: string;
	isActive(match: RouteMatch): boolean;
	children?: NavItem[];
}

const navItems: NavItem[] = [
	{
		key: "blog",
		label: "Blog",
		to: "/admin/blog",
		isActive: (match) => match.id.startsWith("routes/admin/blog"),
		children: [
			{
				key: "all-posts",
				label: "All Posts",
				to: "/admin/blog",
				isActive: (match) => match.id === "routes/admin/blog/index",
			},
			{
				key: "add-new",
				label: "Add New",
				to: "/admin/blog/new",
				isActive: (match) => match.id === "routes/admin/blog/new",
			},
		],
	},
];

const ROOT_CLASS = "cs--admin";

export default function AdminBlogLayout() {
	let { user } = useLoaderData<typeof loader>();
	let matches = useMatches();

	let userInitials = user.nameFirst
		? user.nameFirst[0] + (user.nameLast?.[0] || user.nameFirst[1])
		: user.email.slice(0, 2);

	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__inner`}>
				<div className={`${ROOT_CLASS}__header`}>
					<AdminHeader userInitials={userInitials} userEmail={user.email} />
				</div>

				<div className={`${ROOT_CLASS}__main`}>
					<nav className={`${ROOT_CLASS}__nav`}>
						<div className={`${ROOT_CLASS}__nav-inner`}>
							<ul className={`${ROOT_CLASS}__nav-list`}>
								{navItems.map((item) => {
									let isActive = matches.some(item.isActive);
									return (
										<li className={`${ROOT_CLASS}__nav-item`} key={item.key}>
											<Link className={`${ROOT_CLASS}__nav-link`} to={item.to}>
												{item.label}
											</Link>
											{isActive && item.children && item.children.length > 0 ? (
												<ul
													className={`${ROOT_CLASS}__nav-list`}
													data-level="2"
												>
													{item.children.map((child) => {
														let isActive = matches.some(child.isActive);
														return (
															<li
																key={child.key}
																className={`${ROOT_CLASS}__nav-item`}
																data-level="2"
															>
																<Link
																	data-level="2"
																	className={cx(`${ROOT_CLASS}__nav-link`, {
																		[`${ROOT_CLASS}__nav-link--active`]:
																			isActive,
																	})}
																	aria-current={isActive ? "page" : undefined}
																	to={child.to}
																>
																	{child.label}
																</Link>
															</li>
														);
													})}
												</ul>
											) : null}
										</li>
									);
								})}
							</ul>
						</div>
					</nav>

					<main className={`${ROOT_CLASS}__outlet`}>
						<div className={`${ROOT_CLASS}__outlet-inner`}>
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
