/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
// import { redirect } from "@remix-run/node";
import { Container } from "~/ui/container";
import { HeadingLevelProvider } from "~/ui/primitives/heading";
import { Text } from "~/ui/text";
import { bem } from "~/lib/utils";
import routeStylesUrl from "~/dist/styles/routes/__main/about.css";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import cx from "clsx";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/ui/primitives/button";
import { socialIconLinks } from "~/lib/social-icon-links";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

export function meta() {
	return getSeoMeta({
		...DEFAULT_METADATA,
		title: "About Chance",
	});
}

const ROOT_CLASS = "page--about";

export default function AboutRoute() {
	let fetcher = useFetcher();
	let { errors, values } = fetcher.data || {};
	return (
		<main className={ROOT_CLASS}>
			<h1 className="sr-only">About</h1>
			<HeadingLevelProvider>
				<Container purpose="header">
					<section className={bem(ROOT_CLASS, "intro")}>
						<div className={bem(ROOT_CLASS, "intro-block")}>
							<Text as="Heading" variant="heading-2" color="weaker">
								Who Is{" "}
								<Text as="span" color="text">
									Chance
								</Text>
								?
							</Text>
							<div>
								<p>
									Hola! As you may have gathered, my name is Chance and I’m a
									software-slinger based in San Diego, CA. I currently work on
									the Remix web framework at Shopify.
								</p>
								<p>
									I’m also a big collector of hobbies, so what I do outside work
									hours changes from time to time. Here are just a few items in
									the cycle.
								</p>
							</div>
							<ul className={bem(ROOT_CLASS, "intro-tags")}>
								{[
									"Surfing",
									"Drumming",
									"Running",
									"Guitar",
									"Climbing",
									"Skateboarding",
									"Cooking",
									"Snorkeling",
									"Backpacking",
								].map((tag) => {
									return (
										<li key={tag} className={bem(ROOT_CLASS, "intro-tag")}>
											{tag}
										</li>
									);
								})}
							</ul>
						</div>
						<HeadingLevelProvider>
							<div className={bem(ROOT_CLASS, "intro-block")}>
								<Text as="Heading" variant="heading-2" color="weaker">
									Fast{" "}
									<Text as="span" color="text">
										Facts
									</Text>
									.
								</Text>
								<div>
									<ul className={bem(ROOT_CLASS, "intro-facts-list")}>
										<li>
											I spent a few weeks hiking the Camino de Santiago in
											Northern Spain a few years back
										</li>
										<li>
											I won my elementary school spelling be in{" "}
											<a
												href="#intro-footnote-spelling-bee"
												aria-describedby="intro-footnotes-label"
											>
												4th grade
											</a>
										</li>
										<li>I ran a marathon in Antarctica in January 2022</li>
										<li>I’m left-handed</li>
										<li>
											I worked full-time on both{" "}
											<a
												href="#intro-footnote-a11y"
												aria-describedby="intro-footnotes-label"
											>
												Reach UI and Radix UI
											</a>
										</li>
										<li>
											I’ve been to{" "}
											<a
												href="#intro-footnote-states"
												aria-describedby="intro-footnotes-label"
											>
												44/50 states in the US
											</a>
										</li>
									</ul>
									<footer
										className={bem(ROOT_CLASS, "intro-footnotes")}
										aria-labelledby="intro-footnotes-label"
									>
										<div className="sr-only" id="intro-footnotes-label">
											Footnotes
										</div>
										<ol className={bem(ROOT_CLASS, "intro-footnotes-list")}>
											<li
												id="intro-footnote-spelling-bee"
												className={bem(ROOT_CLASS, "intro-footnotes-item")}
											>
												I ultimately lost at the county level by mispelling the
												word <em>irksome</em>. This still irks me to this day.
											</li>
											<li
												id="intro-footnote-a11y"
												className={bem(ROOT_CLASS, "intro-footnotes-item")}
											>
												I really enjoy accessibility, UI components and API
												design.
											</li>
											<li
												id="intro-footnote-states"
												className={bem(ROOT_CLASS, "intro-footnotes-item")}
											>
												Someone please give me a reason to visit Iowa.
											</li>
										</ol>
									</footer>
								</div>
							</div>
						</HeadingLevelProvider>
					</section>
				</Container>

				<Container purpose="header">
					<section className={bem(ROOT_CLASS, "featured")}>
						<Text as="Heading" variant="heading-2" color="weaker">
							Featured{" "}
							<Text as="span" color="text">
								Content
							</Text>
							.
						</Text>
						<HeadingLevelProvider>
							<ul className={bem(ROOT_CLASS, "featured-items")}>
								{[
									{
										id: "1",
										img: "https://picsum.photos/600/600",
										heading: "Streaming With Theo",
										desc: "I chat with Theo—streamer, YouTuber and holder of many opinions—to convince him to give Remix a fair shot.",
										to: "https://www.twitch.tv/theo/video/1643480153",
									},
									// {
									// 	id: "2",
									// 	img: "https://picsum.photos/501/400",
									// 	heading: "PodRocket Podcast",
									// 	desc: "I talk shop with the LogRocket crew about how Remix helps developers build better websites out of the box.",
									// 	to: "https://podrocket.logrocket.com/remix",
									// },
									{
										id: "3",
										img: "https://picsum.photos/502/400",
										heading: "Learn With Jason",
										desc: "I join my friend Jason Lengstorf and teach him how to build an esbuild plugin.",
										to: "https://www.youtube.com/watch?v=O7U-b9knR6U",
									},
									{
										id: "4",
										img: "https://picsum.photos/503/400",
										heading: "Some Antics",
										desc: "I teach Ben Myers how we can build an accessible, progressively enhanced project management app with Remix.",
										to: "https://www.youtube.com/watch?v=QpP3daA2na4",
									},
								].map((item) => {
									return (
										<li
											key={item.id}
											className={bem(ROOT_CLASS, "featured-item")}
										>
											<a
												aria-labelledby={`featured-item-${item.id}-label`}
												href={item.to}
												className={bem(ROOT_CLASS, "featured-item-link")}
											>
												<div className={bem(ROOT_CLASS, "featured-item-card")}>
													<img
														src={item.img}
														alt=""
														className={bem(ROOT_CLASS, "featured-item-img")}
													/>
													<div
														className={bem(ROOT_CLASS, "featured-item-body")}
													>
														<Text
															as="Heading"
															variant="heading-3"
															id={`featured-item-${item.id}-label`}
														>
															{item.heading}
														</Text>
														<Text as="p" variant="body">
															{item.desc}
														</Text>
													</div>
												</div>
											</a>
										</li>
									);
								})}
							</ul>
						</HeadingLevelProvider>
					</section>
				</Container>

				{/* <Container purpose="header">
					<section className={bem(ROOT_CLASS, "sign-up")}>
						<div className={bem(ROOT_CLASS, "sign-up-inner")}>
							<div
								className={cx(
									bem(ROOT_CLASS, "sign-up-body"),
									"prose prose-tight"
								)}
							>
								<Text as="Heading" variant="heading-2" color="weaker">
									What am I building?{" "}
									<Text as="div" color="text">
										Join me to stay in the loop.
									</Text>
								</Text>
								<Text>
									I send out infrequent emails—trust me, I hate spam too—with
									updates about Remix, my course Front to Back, events, and
									other goodies from my software journey.
								</Text>
								<HeadingLevelProvider>
									<SocialNavContent
										area="left"
										className={bem(ROOT_CLASS, "social-content")}
									/>
								</HeadingLevelProvider>
							</div>
							<div className={bem(ROOT_CLASS, "sign-up-form")}>
								<div className={bem(ROOT_CLASS, "sign-up-card")}>
									<SignUpForm
										formComponent={fetcher.Form}
										fields={
											<>
												<SignUpFormField
													id="form-field-name"
													name="name"
													errorMessage={errors?.name}
													defaultValue={values?.name || undefined}
													label="Your name"
													required
													type="text"
												/>
												<SignUpFormField
													id="form-field-email"
													name="email"
													errorMessage={errors?.email}
													defaultValue={values?.email || undefined}
													label="Email"
													required
													type="email"
												/>
											</>
										}
										submitButton={
											<Button
												type="submit"
												className="button button-primary button-block"
											>
												Sign Up
											</Button>
										}
									/>
								</div>
								<div className={bem(ROOT_CLASS, "social-nav")}>
									<HeadingLevelProvider>
										<SocialNavContent
											area="bottom"
											className={bem(ROOT_CLASS, "social-content")}
										/>
										<SocialNavList />
									</HeadingLevelProvider>
								</div>
							</div>
						</div>
					</section>
				</Container> */}
			</HeadingLevelProvider>
		</main>
	);
}

function SocialNavContent({
	area,
	className,
}: {
	area: "left" | "bottom";
	className?: string;
}) {
	return (
		<div className={cx(className, area)}>
			<Text as="Heading" variant="heading-3">
				Not into email?
			</Text>
			<Text>
				That’s ok, I truly get it! There are a few other places you can follow
				me on the web.
			</Text>
		</div>
	);
}

function SocialNavList() {
	const ROOT_CLASS = "social-nav-list";
	return (
		// eslint-disable-next-line jsx-a11y/no-redundant-roles
		<ul className={ROOT_CLASS} role="list">
			{socialIconLinks.map(({ href, label, Icon, id }) => {
				return (
					// eslint-disable-next-line jsx-a11y/no-redundant-roles
					<li
						key={label}
						className={bem(ROOT_CLASS, "nav-item")}
						role="listitem"
					>
						<a
							href={href}
							aria-label={label}
							className={bem(ROOT_CLASS, "nav-link")}
							title={label}
						>
							<span className={bem(ROOT_CLASS, "nav-icon")}>
								<Icon titleId={`social-icon-${id}`} aria-hidden />
							</span>
							<span className="sr-only">{label}</span>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
