import { Form } from "@remix-run/react";

export function AdminHeader({
	userInitials,
	userEmail,
}: {
	userInitials: string;
	userEmail: string;
}) {
	return (
		<header className="AdminHeader">
			<Form action="/logout" method="post" className="AdminHeader__form">
				<button type="submit" className="AdminHeader__logout-button">
					Log out
				</button>
				<div className="AdminHeader__user-avatar">
					<span aria-hidden className="AdminHeader__user-initials">
						{userInitials}
					</span>
					<p className="sr-only">
						Logged in as <span className="nobr">{userEmail}.</span>
					</p>
				</div>
			</Form>
		</header>
	);
}
