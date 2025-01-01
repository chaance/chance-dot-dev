import { GitHubIcon, LinkedInIcon, BlueskyIcon } from "./icons";
import { Link } from "react-router";

export function SocialNav() {
	return (
		<nav aria-label="social" className="SocialNav">
			<ul className="SocialNav__nav-list">
				{[
					{
						label: "Bluesky",
						href: "https://bsky.app/profile/chance.dev",
						icon: <BlueskyIcon titleId="footer-icon-bluesky" aria-hidden />,
					},
					{
						label: "GitHub",
						href: "https://www.github.com/chaance/",
						icon: <GitHubIcon titleId="footer-icon-github" aria-hidden />,
					},
					{
						label: "LinkedIn",
						href: "https://www.linkedin.com/in/chaance/",
						icon: <LinkedInIcon titleId="footer-icon-linkedin" aria-hidden />,
					},
				].map(({ label, icon, href }) => {
					return (
						<li key={label} className="SocialNav__nav-item">
							<Link
								to={href}
								rel="noreferrer"
								target="_blank"
								className="SocialNav__nav-link"
							>
								<div className="SocialNav__icon">{icon}</div>
								<div className="sr-only">{label}</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
