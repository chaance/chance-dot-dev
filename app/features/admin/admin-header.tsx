import cx from "clsx";
import { Form, Link } from "react-router";

export interface AdminBarEditLink {
	to: string;
	label: string;
}

/**
 * Routes can export `handle.adminBar.editLink` to add an "Edit" link to the
 * admin bar on the public site, e.g. "Edit Post" on a blog post.
 */
export interface AdminBarHandle {
	adminBar?: {
		editLink(loaderData: unknown): AdminBarEditLink | null;
	};
}

export function AdminHeader({
	context = "admin",
	editLink,
	userInitials,
	userName,
	userEmail,
}: {
	/**
	 * `admin` is the bar at the top of the admin screens. `site` is the bar
	 * shown on the public site while logged in. It sticks to the top of the
	 * viewport.
	 */
	context?: "admin" | "site";
	editLink?: AdminBarEditLink | null;
	userInitials: string;
	userName: string;
	userEmail: string;
}) {
	return (
		<header
			className={cx("AdminHeader", `AdminHeader--${context}`)}
			aria-label="Admin toolbar"
		>
			<div className="AdminHeader__group">
				{context === "admin" ? (
					<Link to="/" className="AdminHeader__item AdminHeader__site">
						<HomeIcon />
						chance.dev
						<span className="sr-only"> (view site)</span>
					</Link>
				) : (
					<Link to="/admin" className="AdminHeader__item AdminHeader__site">
						<DashboardIcon />
						Dashboard
					</Link>
				)}
				<Link to="/admin/blog/new" className="AdminHeader__item">
					<span aria-hidden>+</span>
					<span>
						New<span className="AdminHeader__hide-sm"> Post</span>
					</span>
				</Link>
				{editLink ? (
					<Link to={editLink.to} className="AdminHeader__item">
						<EditIcon />
						{editLink.label}
					</Link>
				) : null}
			</div>
			<div className="AdminHeader__group">
				<span className="AdminHeader__item AdminHeader__user" title={userEmail}>
					<span className="AdminHeader__hide-sm">Howdy, {userName}</span>
					<span aria-hidden className="AdminHeader__user-avatar">
						{userInitials}
					</span>
				</span>
				<Form action="/logout" method="post" className="AdminHeader__form">
					<button type="submit" className="AdminHeader__item">
						Log out
					</button>
				</Form>
			</div>
		</header>
	);
}

function Icon({ children }: { children: React.ReactNode }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 20 20"
			width="16"
			height="16"
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

function HomeIcon() {
	return (
		<Icon>
			<path d="M3 9l7-5.5L17 9" />
			<path d="M5 8v8h10V8" />
		</Icon>
	);
}

function DashboardIcon() {
	return (
		<Icon>
			<rect x="3" y="3" width="6" height="8" rx="1" />
			<rect x="11" y="3" width="6" height="5" rx="1" />
			<rect x="11" y="10" width="6" height="7" rx="1" />
			<rect x="3" y="13" width="6" height="4" rx="1" />
		</Icon>
	);
}

function EditIcon() {
	return (
		<Icon>
			<path d="M13.5 3.5l3 3L7 16H4v-3z" />
		</Icon>
	);
}
