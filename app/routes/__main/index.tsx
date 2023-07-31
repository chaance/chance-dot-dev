import { Container } from "~/ui/container";
import { BriefcaseIcon, GlobeIcon } from "~/ui/icons";

import routeStylesUrl from "~/dist/styles/routes/__main/index.css";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import { Link } from "~/ui/primitives/link";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

export function meta() {
	return getSeoMeta(DEFAULT_METADATA);
}

const ROOT_CLASS = "page--home";

export default function HomeRoute() {
	return (
		<main className={ROOT_CLASS}>
			<Container>
				<header data-ui-id="home-header" className={`${ROOT_CLASS}__header`}>
					<div className={`${ROOT_CLASS}__header`}>
						<h1 id="page-title" className={`${ROOT_CLASS}__title`}>
							<span className="block">Chance</span>{" "}
							<span className="block">the Dev</span>
						</h1>
						<p className={`${ROOT_CLASS}__intro`}>
							Web developer. Open source maker.{" "}
							<span className="block">
								Surfing the web and the west coast.
							</span>
						</p>
						<dl className={`${ROOT_CLASS}__intro-list`}>
							<div className={`${ROOT_CLASS}__intro-item`}>
								<dt>
									<span className="sr-only">Current Work</span>
									<BriefcaseIcon
										title="Current Work"
										aria-hidden
										className={`${ROOT_CLASS}__intro-icon`}
									/>
								</dt>
								<dd>
									Software <span aria-hidden>@</span>
									<span className="sr-only">at</span>{" "}
									<a href="https://replo.app" target="_blank" rel="noreferrer">
										Replo
									</a>
								</dd>
							</div>
							<div className={`${ROOT_CLASS}__intro-item`}>
								<dt className={`${ROOT_CLASS}__intro-term`}>
									<span className="sr-only">Current Location</span>
									<GlobeIcon
										title="Current Location"
										aria-hidden
										className={`${ROOT_CLASS}__intro-icon`}
									/>
								</dt>
								<dd className={`${ROOT_CLASS}__intro-desc`}>San Diego, CA</dd>
							</div>
						</dl>
					</div>
				</header>
				<nav aria-label="featured" className={`${ROOT_CLASS}__nav`}>
					<ul className={`${ROOT_CLASS}__nav-list`}>
						<li className={`${ROOT_CLASS}__nav-item`}>
							<Link to="/blog" className={`${ROOT_CLASS}__nav-link`}>
								Articles
							</Link>
						</li>
					</ul>
				</nav>
			</Container>
		</main>
	);
}
