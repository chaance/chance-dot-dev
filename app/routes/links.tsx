import * as React from "react";
import cx from "clsx";
import styles from "./links.module.css";
import { Link, useLocation } from "@remix-run/react";
import { useRootContext } from "~/lib/react/context";
import type { LinkProps } from "@remix-run/react";

type To = LinkProps["to"];

const LINKS = [
	{ to: "https://fronttoback.dev", label: "Front to Back" },
	{ to: "https://chance.dev", label: "Website" },
	{ to: "https://twitter.com/chancethedev", label: "Twitter" },
	{ to: "https://www.linkedin.com/in/chaance", label: "LinkedIn" },
	{ to: "https://www.polywork.com/chance", label: "Polywork" },
	{ to: "https://www.instagram.com/chancethedev", label: "Instagram" },
] satisfies Array<{
	to: To;
	label: string;
}>;

export default function Links() {
	const uuid = React.useId();
	const nameId = `${uuid}name`;
	const location = useLocation();
	const { siteUrl } = useRootContext();
	return (
		<div className={styles.links}>
			<div className={styles.linksInner}>
				<div className={styles.header}>
					<div className={styles.photo}>
						<img
							src="https://avatars.githubusercontent.com/u/3082153?v=4"
							alt=""
							role="none"
							className={styles.photoImg}
						/>
					</div>
					<div className={styles.heading}>
						<h1 id={nameId} className={cx(styles.name, "text-h4")}>
							Chance <em>the Dev</em>
						</h1>
						<div className={cx(styles.desc, "text-sm")}>
							Developer and open source tinkerer. Surfing the web and the west
							coast.
						</div>
					</div>
				</div>
				<div className={styles.linksContainer}>
					{LINKS.map((link) => {
						return (
							<Link
								className={styles.link}
								to={link.to}
								target="_blank"
								rel="noopener"
								aria-describedby={nameId}
							>
								<span className={styles.linkInner}>{link.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
