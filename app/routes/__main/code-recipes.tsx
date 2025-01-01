import * as React from "react";
import { Heading, HeadingLevelProvider } from "~/ui/primitives/heading";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import { useFetcher } from "react-router";
import { useLayoutEffect } from "@chance/hooks/use-layout-effect";
import type { action as signUpAction } from "~/routes/__main/sign-up";
import { SignUpSection } from "~/ui/sign-up-section";
import { data } from "react-router";

export async function loader() {
	// TODO
	throw data(null, 404);
}

export function meta() {
	return getSeoMeta({
		...DEFAULT_METADATA,
		title: "Code Recipes",
	});
}

export default function CodeRecipesRoute() {
	let signUpFetcher = useFetcher<typeof signUpAction>();
	let hasSuccessfulSubmission =
		signUpFetcher.state === "idle" && signUpFetcher.data?.status === "success";

	let formRef = React.useRef<HTMLFormElement>(null);
	useFakeEventHandler(hasSuccessfulSubmission, () => {
		formRef.current?.reset();
	});

	return (
		<main>
			<Heading className="text-h1 mb-4 md:mb-6">
				Code <em className="text-weaker">Recipes</em>
			</Heading>
			<div>
				<HeadingLevelProvider>
					<section>
						<div className="prose text-pretty">
							<div>
								<p>
									As you may have gathered, my name is Chance and I’m a
									software-slinger based in San Diego, CA. I currently work at{" "}
									<a
										href="https://workos.com/"
										target="_blank"
										rel="noopener noreferrer"
									>
										WorkOS
									</a>
									.
								</p>
								<p>
									I’m also a big collector of hobbies, so what I do outside work
									hours changes from time to time.
								</p>
							</div>
							<ul>
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
									return <li key={tag}>{tag}</li>;
								})}
							</ul>

							<Heading>Random facts</Heading>
							<div>
								<ul>
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
									<li>I ran a marathon in Antarctica in 2022</li>
									<li>I’m left-handed</li>
									<li>
										I helped build{" "}
										<a
											href="https://remix.run"
											target="_blank"
											rel="noopener noreferrer"
										>
											Remix
										</a>{" "}
										to help you build better websites
									</li>
									<li>
										I worked full-time on both{" "}
										<a
											href="https://reach.tech"
											target="_blank"
											rel="noopener noreferrer"
										>
											Reach UI
										</a>{" "}
										and{" "}
										<a
											href="https://www.radix-ui.com"
											target="_blank"
											rel="noopener noreferrer"
										>
											Radix UI
										</a>
									</li>
									<li>
										I’ve been to{" "}
										<a
											href="#intro-footnote-states"
											aria-describedby="intro-footnotes-label"
										>
											45/50 states in the US
										</a>
									</li>
								</ul>
							</div>
							<footer aria-label="Footnotes">
								<ol className="text-sm">
									<li id="intro-footnote-spelling-bee">
										I ultimately lost at the county level by mispelling the word{" "}
										<em>irksome</em>. This still irks me to this day.
									</li>
									<li id="intro-footnote-states">
										Someone please give me a reason to visit Iowa.
									</li>
								</ol>
							</footer>
						</div>
					</section>
				</HeadingLevelProvider>
			</div>
			<div>
				<SignUpSection />
			</div>
		</main>
	);
}

function useFakeEventHandler(when: boolean, cb: () => void) {
	let called = React.useRef(false);
	let cbRef = React.useRef(cb);
	useLayoutEffect(() => {
		cbRef.current = cb;
	});
	React.useEffect(() => {
		let cb = cbRef.current;
		// "when" happened and we haven't called yet. We need to track whether or
		// not the cb has in fact been called as effects are not guaranteed to run
		// only when dependencies change.
		if (when && !called.current) {
			called.current = true;
			cb();
		}
		// "when" didn't happen so we reset the call flag
		else if (!when) {
			called.current = false;
		}
	}, [when]);
}
