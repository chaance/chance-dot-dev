import { Form, Link } from "react-router";

export function AdminHeader({
	userInitials,
	userName,
	userEmail,
}: {
	userInitials: string;
	userName: string;
	userEmail: string;
}) {
	return (
		<header className="AdminHeader">
			<div className="AdminHeader__group">
				<Link to="/" className="AdminHeader__item AdminHeader__site">
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
						<path d="M3 9l7-5.5L17 9" />
						<path d="M5 8v8h10V8" />
					</svg>
					chance.dev
					<span className="sr-only"> (view site)</span>
				</Link>
				<Link to="/admin/blog/new" className="AdminHeader__item">
					<span aria-hidden>+</span> New Post
				</Link>
			</div>
			<div className="AdminHeader__group">
				<span className="AdminHeader__item AdminHeader__user" title={userEmail}>
					<span className="AdminHeader__greeting">Howdy, {userName}</span>
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
