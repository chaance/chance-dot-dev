import * as React from "react";
import cx from "clsx";
import { Link, useLocation } from "react-router";
import { useRootContext } from "~/lib/react/root-context";
import type { LinkProps } from "react-router";

import routeStyles from "./links.css?url";

export function links() {
	return [{ rel: "stylesheet", href: routeStyles }];
}

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
		<div className="links-page">
			<div className="links-page__inner">
				<div className="links-page__header">
					<div className="links-page__photo">
						<img
							src="https://avatars.githubusercontent.com/u/3082153?v=4"
							alt=""
							role="none"
						/>
					</div>
					<div className="links-page__heading">
						<h1 id={nameId} className={cx("links-page__name", "text-h4")}>
							Chance <em>the Dev</em>
						</h1>
						<div className={cx("links-page__desc", "text-sm")}>
							Developer and open source tinkerer. Surfing the web and the west
							coast.
						</div>
					</div>
				</div>
				<div className="links-page__container">
					{LINKS.map((link) => {
						return (
							<Link
								className="links-page__link"
								to={link.to}
								target="_blank"
								rel="noopener"
								aria-describedby={nameId}
								key={link.label}
							>
								<span>{link.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
