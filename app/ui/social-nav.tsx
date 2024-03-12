import { GitHubIcon, LinkedInIcon, TwitterIcon } from "./icons";
import { Link } from "@remix-run/react";
import cx from "clsx";
import styles from "./social-nav.module.css";

export function SocialNav() {
	return (
		<nav aria-label="social" className={styles.nav}>
			<ul className={styles.navList}>
				{[
					{
						label: "Twitter",
						href: "https://twitter.com/chancethedev/",
						icon: <TwitterIcon titleId="footer-icon-twitter" aria-hidden />,
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
						<li key={label} className={styles.navItem}>
							<Link
								to={href}
								rel="noreferrer"
								target="_blank"
								className={styles.navLink}
							>
								<div className={styles.icon}>{icon}</div>
								<div className="sr-only">{label}</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
