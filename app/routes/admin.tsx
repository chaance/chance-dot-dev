import type * as React from "react";
import type { LoaderFunctionArgs } from "react-router";
import {
	Link,
	Outlet,
	useLoaderData,
	useMatches,
	type UIMatch,
} from "react-router";
import { requireUser } from "~/lib/session.server";
import cx from "clsx";
import { AdminHeader } from "~/features/admin/admin-header";
import { getUserInitials } from "~/features/admin/admin-utils";

import routeStyles from "./admin.css?url";
export function links() {
	return [{ rel: "stylesheet", href: routeStyles }];
}

export async function loader({ request }: LoaderFunctionArgs) {
	let user = await requireUser(request, "/login");
	return { user };
}

interface NavItem {
	key: string;
	label: string;
	to: string;
	icon?: React.ReactNode;
	isActive(match: UIMatch): boolean;
	children?: NavItem[];
}

const navItems: NavItem[] = [
	{
		key: "blog",
		label: "Posts",
		to: "/admin/blog",
		icon: <PostsIcon />,
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
				label: "Add New Post",
				to: "/admin/blog/new",
				isActive: (match) => match.id === "routes/admin/blog/new",
			},
		],
	},
	{
		key: "subscribers",
		label: "Subscribers",
		to: "/admin/subscribers",
		icon: <SubscribersIcon />,
		isActive: (match) => match.id.startsWith("routes/admin/subscribers"),
		children: [
			{
				key: "all-subscribers",
				label: "All Subscribers",
				to: "/admin/subscribers",
				isActive: (match) => match.id === "routes/admin/subscribers/index",
			},
			{
				key: "add-new",
				label: "Add New Subscriber",
				to: "/admin/subscribers/new",
				isActive: (match) => match.id === "routes/admin/subscribers/new",
			},
		],
	},
	{
		key: "mailing-lists",
		label: "Mailing Lists",
		to: "/admin/mailing-lists",
		icon: <MailingListsIcon />,
		isActive: (match) => match.id.startsWith("routes/admin/mailing-lists"),
		children: [
			{
				key: "all-mailing-lists",
				label: "All Mailing Lists",
				to: "/admin/mailing-lists",
				isActive: (match) => match.id === "routes/admin/mailing-lists/index",
			},
			{
				key: "add-new",
				label: "Add New List",
				to: "/admin/mailing-lists/new",
				isActive: (match) => match.id === "routes/admin/mailing-lists/new",
			},
		],
	},
];

const ROOT_CLASS = "admin";

export default function AdminLayout() {
	let { user } = useLoaderData<typeof loader>();
	let matches = useMatches();

	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__header`}>
				<AdminHeader
					userInitials={getUserInitials(user)}
					userName={user.nameFirst || user.email}
					userEmail={user.email}
				/>
			</div>

			<nav className={`${ROOT_CLASS}__nav`} aria-label="Admin">
				<ul className={`${ROOT_CLASS}__nav-list`}>
					{navItems.map((item) => {
						let isActive = matches.some(item.isActive);
						return (
							<li
								className={cx(`${ROOT_CLASS}__nav-item`, {
									[`${ROOT_CLASS}__nav-item--active`]: isActive,
								})}
								key={item.key}
							>
								<Link className={`${ROOT_CLASS}__nav-link`} to={item.to}>
									{item.icon ? (
										<span className={`${ROOT_CLASS}__nav-icon`} aria-hidden>
											{item.icon}
										</span>
									) : null}
									{item.label}
								</Link>
								{isActive && item.children && item.children.length > 0 ? (
									<ul className={`${ROOT_CLASS}__subnav-list`}>
										{item.children.map((child) => {
											let isActive = matches.some(child.isActive);
											return (
												<li key={child.key}>
													<Link
														className={cx(`${ROOT_CLASS}__subnav-link`, {
															[`${ROOT_CLASS}__subnav-link--active`]: isActive,
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
			</nav>

			<main className={`${ROOT_CLASS}__outlet`}>
				<Outlet />
			</main>
		</div>
	);
}

function NavIcon({ children }: { children: React.ReactNode }) {
	return (
		<svg
			viewBox="0 0 20 20"
			width="20"
			height="20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{children}
		</svg>
	);
}

function PostsIcon() {
	return (
		<NavIcon>
			<path d="M13.5 3.5l3 3L8 15H5v-3l8.5-8.5z" />
			<path d="M11.5 5.5l3 3" />
		</NavIcon>
	);
}

function SubscribersIcon() {
	return (
		<NavIcon>
			<circle cx="7.5" cy="7" r="2.75" />
			<path d="M2.5 16c0-2.75 2.25-4.5 5-4.5s5 1.75 5 4.5" />
			<path d="M13 4.5a2.5 2.5 0 010 5" />
			<path d="M15 11.75c1.5.5 2.5 1.9 2.5 4.25" />
		</NavIcon>
	);
}

function MailingListsIcon() {
	return (
		<NavIcon>
			<rect x="2.5" y="4.5" width="15" height="11" rx="1" />
			<path d="M3 5.5l7 5.5 7-5.5" />
		</NavIcon>
	);
}
