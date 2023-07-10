import { Container } from "~/ui/container";
import { BriefcaseIcon, GlobeIcon } from "~/ui/icons";
import { HeadingLevelProvider } from "~/ui/primitives/heading";
import { Text, TextGroup, TextListItem, TextProse } from "~/ui/text";
import { bem } from "~/lib/utils";
import routeStylesUrl from "~/dist/styles/routes/__main/about.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "page--about";

export default function AboutRoute() {
	return (
		<main className={ROOT_CLASS}>
			<h1 className="sr-only">About</h1>
			<HeadingLevelProvider>
				<section className={bem(ROOT_CLASS, "intro")}>
					<div>
						<Text as="Heading" variant="heading-2" color="weaker">
							Who Is{" "}
							<Text as="span" color="text">
								Chance
							</Text>
							?
						</Text>
						<TextProse variant="body-md">
							<p>
								Hola! As you may have gathered, my name is Chance and I’m a
								software-slinger based in San Diego, CA. I currently work on the
								Remix web framework at Shopify.
							</p>
							<p>
								I’m also a big collector of hobbies, so what I do outside work
								hours changes from time to time. Here are just a few items in
								the cycle.
							</p>
						</TextProse>
					</div>
					<HeadingLevelProvider>
						<div>
							<Text as="Heading" variant="heading-2">
								Fast Facts
							</Text>
							<TextGroup variant="body-md">
								<ul>
									<TextListItem>
										I spent a few weeks hiking the Camino de Santiago in
										Northern Spain a few years back
									</TextListItem>
									<TextListItem>
										I won my elementary school spelling be in 4th grade 2
									</TextListItem>
									<TextListItem>
										I ran a marathon in Antarctica in January 2022
									</TextListItem>
									<TextListItem>I’m left-handed</TextListItem>
									<TextListItem>
										I worked full-time on both Reach UI and Radix UI 1
									</TextListItem>
									<TextListItem>
										I’ve been to 44/50 states in the US 2
									</TextListItem>
								</ul>
							</TextGroup>
						</div>
					</HeadingLevelProvider>
				</section>
			</HeadingLevelProvider>
			<section>
				<Container>
					<div className={`${ROOT_CLASS}__header`}>
						<h1 id="page-title" className={`${ROOT_CLASS}__title`}>
							<span className="block">Chance</span>{" "}
							<span className="block">the Dev</span>
						</h1>
						<p className={`${ROOT_CLASS}__intro`}>
							Web developer. Open source maker.{" "}
							<span className="sm:block">
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
									<a href="https://remix.run">Remix</a>{" "}
									<span aria-hidden>@</span>
									<span className="sr-only">at</span> Shopify
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
				</Container>
			</section>
		</main>
	);
}
