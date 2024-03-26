import * as React from "react";
import { HeadingLevelProvider } from "~/ui/primitives/heading";
import { bem } from "~/lib/utils";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import { SignUpSection } from "~/ui/sign-up-section";

import { Card } from "~/ui/card";
import "./content.css";
import { redirect } from "@remix-run/node";

export function loader() {
	// TODO: Remove when this page is ready again
	return redirect("/", 307);
}

export function meta() {
	return getSeoMeta({
		...DEFAULT_METADATA,
		title: "About Chance",
	});
}

export default function ContentRoute() {
	return (
		<main>
			<div>
				<div>
					<div>
						<h1>
							Featured <span className="text-weaker">Content</span>
						</h1>
					</div>
					<HeadingLevelProvider>
						<ul>
							{[
								{
									id: "1",
									img: "https://res.cloudinary.com/chancethedev/image/upload/v1672455509/chance.dev/theo.jpg",
									heading: "Theo (t3.gg)",
									desc: "I chat with Theo—streamer, YouTuber and holder of many opinions—to convince him to give Remix a fair shot.",
									to: "https://www.youtube.com/watch?v=iNvNYt53oOI",
								},
								{
									id: "2",
									img: "https://picsum.photos/501/400",
									heading: "PodRocket Podcast",
									desc: "I talk shop with the LogRocket crew about how Remix helps developers build better websites out of the box.",
									to: "https://podrocket.logrocket.com/remix",
								},
								{
									id: "3",
									img: "https://res.cloudinary.com/chancethedev/image/upload/v1672455509/chance.dev/learn-with-jason.jpg",
									heading: "Learn With Jason",
									desc: "I join my friend Jason Lengstorf and teach him how to build an esbuild plugin.",
									to: "https://www.youtube.com/watch?v=O7U-b9knR6U",
								},
								{
									id: "4",
									img: "https://res.cloudinary.com/chancethedev/image/upload/v1672455509/chance.dev/some-antics.jpg",
									heading: "Some Antics",
									desc: "I teach Ben Myers how we can build an accessible, progressively enhanced project management app with Remix.",
									to: "https://www.youtube.com/watch?v=QpP3daA2na4",
								},
							].map((item) => {
								return (
									<li key={item.id}>
										<a
											aria-labelledby={`featured-item-${item.id}-label`}
											href={item.to}
										>
											<div>
												<Card uncard="sm-down" depth={false}>
													<div>
														<h3 id={`featured-item-${item.id}-label`}>
															{item.heading}
														</h3>
														<p>{item.desc}</p>
													</div>
												</Card>
											</div>
										</a>
									</li>
								);
							})}
						</ul>
					</HeadingLevelProvider>
				</div>
			</div>

			<div>
				<SignUpSection />
			</div>
		</main>
	);
}
