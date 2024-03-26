import * as React from "react";
import { HeadingLevelProvider } from "~/ui/primitives/heading";
import { bem } from "~/lib/utils";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import { redirect, useFetcher } from "@remix-run/react";
import { useLayoutEffect } from "@chance/hooks/use-layout-effect";
import type { action as signUpAction } from "~/routes/__main/sign-up";
import { SignUpSection } from "~/ui/sign-up-section";

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

const ROOT_CLASS = "page--about";

export default function AboutRoute() {
	let signUpFetcher = useFetcher<typeof signUpAction>();
	let hasSuccessfulSubmission =
		signUpFetcher.state === "idle" && signUpFetcher.data?.status === "success";

	let formRef = React.useRef<HTMLFormElement>(null);
	useFakeEventHandler(hasSuccessfulSubmission, () => {
		formRef.current?.reset();
	});

	return (
		<main className={ROOT_CLASS}>
			<h1 className="sr-only">About Chance</h1>
			<HeadingLevelProvider>
				<div>
					<section className={bem(ROOT_CLASS, "intro")}>
						<div className={bem(ROOT_CLASS, "intro-heading")}>
							<h2 className="h1">
								Who <span className="text-weaker">am I</span>?
							</h2>
						</div>
						<div className={bem(ROOT_CLASS, "intro-block")}>
							<div>
								<p>
									As you may have gathered, my name is Chance and I’m a
									software-slinger based in San Diego, CA. I currently work on
									Replo, a no-code page builder designed for Shopify store
									owners.
								</p>
								<p>
									I’m also a big collector of hobbies, so what I do outside work
									hours changes from time to time.
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
									<li>I ran a marathon in Antarctica in 2022</li>
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
						</HeadingLevelProvider>
					</section>
				</div>
				<div>
					<SignUpSection />
				</div>
			</HeadingLevelProvider>
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
