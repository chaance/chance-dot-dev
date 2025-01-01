import * as React from "react";
import { Heading, HeadingLevelProvider } from "~/ui/primitives/heading";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
// import { useFetcher } from "@remix-run/react";
// import { useLayoutEffect } from "@chance/hooks/use-layout-effect";
// import type { action as signUpAction } from "~/routes/__main/sign-up";
import { SignUpSection } from "~/ui/sign-up-section";

export function meta() {
	return getSeoMeta({
		...DEFAULT_METADATA,
		title: "About Chance",
	});
}

export default function AboutRoute() {
	// let signUpFetcher = useFetcher<typeof signUpAction>();
	// let hasSuccessfulSubmission =
	// 	signUpFetcher.state === "idle" && signUpFetcher.data?.status === "success";

	// let formRef = React.useRef<HTMLFormElement>(null);
	// useFakeEventHandler(hasSuccessfulSubmission, () => {
	// 	formRef.current?.reset();
	// });

	return (
		<main>
			<Heading className="sr-only">About Chance</Heading>
			<HeadingLevelProvider>
				<div>
					<section>
						<div aria-hidden className="text-h1 mb-4 md:mb-6">
							Who <em className="text-weaker">am I?</em>
						</div>

						<div className="prose text-pretty">
							<p>
								As you may have gathered, my name is Chance and I’m a software
								engineer based in <span className="text-nowrap">San Diego</span>
								, CA. I work with some really smart people at{" "}
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
								hours changes from time to time. Today you might find me:
							</p>

							<ul>
								<li>Surfing</li>
								<li>Drumming</li>
								<li>Running</li>
								<li>Playing guitar</li>
								<li>Climbing</li>
								<li>Skateboarding</li>
								<li>Cooking</li>
								<li>Snorkeling</li>
								<li>Backpacking</li>
							</ul>

							<Heading>Random facts</Heading>

							<ul className="text-pretty">
								<li>
									I spent a few weeks hiking the{" "}
									<a
										href="https://caminoways.com/camino-del-norte"
										target="_blank"
										rel="noopener noreferrer"
									>
										Camino de Santiago
									</a>{" "}
									in Northern Spain
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
								<li>
									I ran a{" "}
									<a
										href="https://marathontours.com/en-us/seven-continents-club/"
										target="_blank"
										rel="noopener noreferrer"
									>
										half-marathon in Antarctica
									</a>{" "}
									in 2022
								</li>
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

							<footer aria-label="Footnotes">
								<ol className="text-sm text-pretty">
									<li id="intro-footnote-spelling-bee">
										I ultimately lost at the county level by mispelling the word{" "}
										<em>irksome</em>, a fact which irks me to this very day.
									</li>
									<li id="intro-footnote-states">
										Someone please give me a reason to visit Iowa.
									</li>
								</ol>
							</footer>
						</div>
					</section>
				</div>
			</HeadingLevelProvider>

			<SignUpSection />
		</main>
	);
}

// function useFakeEventHandler(when: boolean, cb: () => void) {
// 	let called = React.useRef(false);
// 	let cbRef = React.useRef(cb);
// 	useLayoutEffect(() => {
// 		cbRef.current = cb;
// 	});
// 	React.useEffect(() => {
// 		let cb = cbRef.current;
// 		// "when" happened and we haven't called yet. We need to track whether or
// 		// not the cb has in fact been called as effects are not guaranteed to run
// 		// only when dependencies change.
// 		if (when && !called.current) {
// 			called.current = true;
// 			cb();
// 		}
// 		// "when" didn't happen so we reset the call flag
// 		else if (!when) {
// 			called.current = false;
// 		}
// 	}, [when]);
// }
