import { Form } from "@remix-run/react";
import cx from "clsx";

const ROOT_CLASS = "cs--admin-header";

export function AdminHeader({
	userInitials,
	userEmail,
	className,
}: {
	userInitials: string;
	userEmail: string;
	className?: string;
}) {
	return (
		<header className={cx(ROOT_CLASS, className)}>
			<Form action="/logout" method="post" className={`${ROOT_CLASS}__form`}>
				<button type="submit" className={`${ROOT_CLASS}__logout-button`}>
					Log out
				</button>
				<div className={`${ROOT_CLASS}__user-avatar`}>
					<span aria-hidden className={`${ROOT_CLASS}__user-initials`}>
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
