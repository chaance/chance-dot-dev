// import { redirect } from "@remix-run/node";
import { Container } from "~/ui/container";
import routeStylesUrl from "~/dist/styles/routes/links.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

export function meta() {
	return {
		title: "JSWorld Links | chance.dev",
	}
}

const LINKS = [
	{
		title: "Oops—I Guess We're Full-Stack Developers Now",
		desc: "Chris Coyier, 2019",
		url: "https://www.youtube.com/watch?v=lFOfQsi5ye0",
	},
	{
		title: "The Great Divide",
		desc: "Chris Coyier, 2019",
		url: "https://css-tricks.com/the-great-divide/",
	},
	{
		title: "When to Fetch?",
		desc: "Ryan Florence, 2022",
		url: "https://www.youtube.com/watch?v=95B8mnhzoCM",
	},
];

const ROOT_CLASS = "page--links";

export default function JSWorldRoute() {
	return (
		<main className={ROOT_CLASS}>
			<Container fullHeight>
				<div className={`${ROOT_CLASS}__wrap`}>
					<h1 className={`${ROOT_CLASS}__title`}>Links</h1>
					<dl className={`${ROOT_CLASS}__list`}>
						{LINKS.map((link, i) => {
							return (
								<div className={`${ROOT_CLASS}__list-item`}>
									<dt className={`${ROOT_CLASS}__list-item-title`}>
										<a
											href={link.url}
											aria-describedby={`link-desc-${i}`}
											className={`${ROOT_CLASS}__list-item-link`}
										>
											{link.title}
										</a>
									</dt>
									<dd
										id={`link-desc-${i}`}
										className={`${ROOT_CLASS}__list-item-desc`}
									>
										{link.desc}
									</dd>
								</div>
							);
						})}
					</dl>
				</div>
			</Container>
		</main>
	);
}
