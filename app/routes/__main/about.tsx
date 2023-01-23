/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
// import { redirect } from "@remix-run/node";
import { Container } from "~/ui/container";
import { HeadingLevelProvider } from "~/ui/primitives/heading";
import { Text } from "~/ui/text";
import { bem } from "~/lib/utils";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import cx from "clsx";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/ui/primitives/button";
import { socialIconLinks } from "~/lib/social-icon-links";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";
import { useIsHydrated } from "~/lib/react/use-is-hydrated";
import type { action as signUpAction } from "~/routes/__main/sign-up";

import routeStylesUrl from "~/dist/styles/routes/__main/about.css";

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
const CONVERT_KIT_FORM_ID = "3906586";

export default function AboutRoute() {
	let signUpFetcher = useFetcher<typeof signUpAction>();
	let { errors } = signUpFetcher.data || {};
	let isHydrated = useIsHydrated();
	let hasSuccessfulSubmission =
		signUpFetcher.type === "done" && signUpFetcher.data.status === "success";

	let formRef = React.useRef<HTMLFormElement>(null);
	useFakeEventHandler(hasSuccessfulSubmission, () => {
		formRef.current?.reset();
	});

	let [formPopupIsVisible, setFormPopupIsVisible] = React.useState(false);
	React.useEffect(() => {
		if (hasSuccessfulSubmission) {
			setFormPopupIsVisible(true);
			let timeout = window.setTimeout(() => {
				setFormPopupIsVisible(false);
			}, 6000);
			return () => {
				window.clearTimeout(timeout);
			};
		}
	}, [hasSuccessfulSubmission]);

	// TODO
	let alreadySubscribed = false;

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
										img: "https://res.cloudinary.com/chancethedev/image/upload/v1672455509/chance.dev/theo.jpg",
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

				<Container purpose="header">
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
										aria-hidden
									/>
								</HeadingLevelProvider>
							</div>
							<div className={bem(ROOT_CLASS, "sign-up-form")}>
								<div className={bem(ROOT_CLASS, "sign-up-card")}>
									<SignUpForm
										formComponent={signUpFetcher.Form}
										ref={formRef}
										fields={
											<>
												<SignUpFormField
													id="form-field-email"
													name="email"
													errorMessage={errors?.email}
													label="Email"
													required
													type="email"
												/>
												<SignUpFormField
													id="form-field-name-first"
													name="nameFirst"
													errorMessage={errors?.nameFirst}
													label="First name"
													type="text"
												/>
												<SignUpFormField
													id="form-field-name-last"
													name="nameLast"
													errorMessage={errors?.nameLast}
													label="Last name"
													type="text"
												/>
												<div className="sr-only">
													<label htmlFor="form-field-phone">Phone number</label>
													<span id="phone-desc">
														Screen-reader users: do not complete this field or
														the form submission will fail.
													</span>
													<input
														tabIndex={-1}
														id="form-field-phone"
														aria-describedby="phone-desc"
														type="text"
														name="phone"
														autoComplete="nope"
													/>
													<input
														type="hidden"
														name="convertKitFormId"
														value={CONVERT_KIT_FORM_ID}
													/>
													{isHydrated ? (
														<input
															type="hidden"
															name="preventRedirect"
															value="true"
														/>
													) : null}
												</div>
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
									{(
										isHydrated ? formPopupIsVisible : hasSuccessfulSubmission
									) ? (
										<div
											style={
												isHydrated
													? {
															position: "absolute",
															left: 0,
															padding: "inherit",
															background: "inherit",
															boxShadow: "inherit",
															borderRadius: "inherit",
															top: `calc(100% + 1rem)`,
															zIndex: 1,
													  }
													: {
															marginTop: "1rem",
													  }
											}
										>
											<Text color="success">
												Thanks for signing up! Check your email to confirm your
												subscription.
											</Text>
										</div>
									) : null}
								</div>
								<div className={bem(ROOT_CLASS, "social-nav")}>
									<HeadingLevelProvider>
										<SocialNavContent
											area="bottom"
											className={cx(
												bem(ROOT_CLASS, "social-content"),
												"md:sr-only"
											)}
										/>
										<SocialNavList />
									</HeadingLevelProvider>
									<Arrow
										className={bem(ROOT_CLASS, "sign-up-arrow")}
										aria-hidden
									/>
								</div>
							</div>
						</div>
					</section>
				</Container>
			</HeadingLevelProvider>
		</main>
	);
}

function SocialNavContent({
	area,
	className,
	"aria-hidden": ariaHidden,
}: {
	area: "left" | "bottom";
	className?: string;
	"aria-hidden"?: boolean;
}) {
	return (
		<div className={cx(className, area)} aria-hidden={ariaHidden}>
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

function Arrow(props: { className?: string; "aria-hidden"?: boolean }) {
	return (
		<svg viewBox="0 0 458 149" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M5.04609 1.84996C6.08316 4.8248 7.04322 7.32263 7.92628 9.34347C8.80933 11.3643 10.0774 13.7647 11.7306 16.5446C13.3837 19.3246 15.3141 22.2276 17.5218 25.2537C19.7294 28.2799 22.1527 31.2803 24.7916 34.2552C27.4304 37.23 30.5263 40.3998 34.079 43.7644C37.6318 47.129 41.7749 50.6835 46.5085 54.4277C51.2421 58.1718 56.3042 61.7622 61.6949 65.1986C67.0857 68.6351 72.7947 71.9125 78.8221 75.031C84.8494 78.1494 91.2926 81.1294 98.1517 83.9709C105.011 86.8124 112.286 89.5102 119.976 92.0645C127.667 94.6187 135.717 96.9576 144.127 99.081C152.536 101.204 160.664 103.056 168.508 104.636C176.353 106.215 183.962 107.518 191.334 108.544C198.707 109.57 206.957 110.498 216.085 111.329C225.214 112.16 234.547 112.822 244.086 113.314C253.625 113.806 262.466 114.196 270.609 114.483C278.751 114.771 286.986 114.899 295.314 114.868C303.641 114.837 312.01 114.653 320.419 114.314C328.829 113.976 336.442 113.488 343.26 112.852C350.078 112.216 356.265 111.565 361.82 110.898C367.375 110.232 372.483 109.513 377.145 108.744C381.807 107.975 386.165 107.216 390.221 106.467C394.277 105.718 398.148 104.938 401.834 104.128C405.521 103.318 408.873 102.579 411.892 101.912C414.911 101.245 417.545 100.625 419.793 100.05C422.042 99.4759 424.08 98.9323 425.908 98.4194C427.736 97.9065 429.409 97.373 430.929 96.8191C432.449 96.2652 433.84 95.7523 435.103 95.2804C436.366 94.8085 438.589 94.1264 441.772 93.2339C444.955 92.3415 446.711 91.9004 447.04 91.9106C447.368 91.9209 447.676 91.9722 447.964 92.0645C448.251 92.1568 448.523 92.3056 448.78 92.5107C449.037 92.7159 449.247 92.9416 449.412 93.1877C449.576 93.4339 449.699 93.716 449.781 94.034C449.863 94.352 449.894 94.6598 449.874 94.9573C449.853 95.2547 449.786 95.5574 449.673 95.8651C449.56 96.1728 449.396 96.4344 449.181 96.6498C448.965 96.8653 448.729 97.0602 448.472 97.2346C448.215 97.4089 447.928 97.5218 447.609 97.5731C447.291 97.6244 446.983 97.6397 446.685 97.6192C446.388 97.5987 446.09 97.5115 445.792 97.3577C445.494 97.2038 445.238 97.0294 445.022 96.8345C444.806 96.6396 444.621 96.3883 444.467 96.0805C444.313 95.7728 444.221 95.4804 444.19 95.2035C444.159 94.9265 444.159 94.6187 444.19 94.2802C444.221 93.9417 444.324 93.6494 444.498 93.4032C444.673 93.157 444.863 92.9159 445.068 92.68C445.274 92.444 445.53 92.2696 445.838 92.1568C446.146 92.044 446.444 91.967 446.732 91.926C447.019 91.885 447.327 91.9055 447.656 91.9876C447.984 92.0696 448.272 92.1876 448.518 92.3415C448.765 92.4953 449.001 92.6954 449.227 92.9416C449.453 93.1877 449.607 93.4545 449.689 93.7417C449.771 94.0289 449.832 94.3315 449.874 94.6495C449.915 94.9675 449.879 95.2753 449.766 95.5727C449.653 95.8702 449.519 96.1472 449.365 96.4036C449.211 96.6601 449.001 96.8807 448.734 97.0653C448.467 97.2499 448.19 97.3936 447.902 97.4961C447.615 97.5987 447.466 97.6449 447.455 97.6346C447.445 97.6244 445.925 97.8552 442.896 98.327C439.867 98.7989 437.685 99.1785 436.351 99.4657C435.016 99.7529 433.558 100.086 431.976 100.466C430.395 100.845 428.665 101.276 426.786 101.758C424.907 102.24 422.833 102.759 420.563 103.312C418.294 103.866 415.645 104.487 412.616 105.174C409.587 105.862 406.214 106.605 402.497 107.405C398.78 108.206 394.878 108.99 390.791 109.76C386.705 110.529 382.31 111.293 377.607 112.052C372.904 112.811 367.76 113.535 362.174 114.222C356.588 114.909 350.356 115.566 343.476 116.191C336.596 116.817 328.931 117.304 320.481 117.653C312.03 118.002 303.626 118.192 295.268 118.223C286.909 118.253 278.644 118.125 270.47 117.838C262.297 117.551 253.425 117.161 243.855 116.668C234.286 116.176 224.901 115.509 215.7 114.668C206.5 113.827 198.188 112.899 190.764 111.883C183.341 110.868 175.67 109.554 167.754 107.944C159.837 106.333 151.643 104.472 143.172 102.358C134.701 100.245 126.574 97.8859 118.79 95.2804C111.007 92.6748 103.64 89.9565 96.6885 87.1252C89.737 84.294 83.1963 81.2781 77.0662 78.0776C70.9362 74.8771 65.1193 71.5586 59.6157 68.1222C54.112 64.6857 48.942 61.0492 44.1058 57.2127C39.2695 53.3762 35.0185 49.7756 31.3528 46.411C27.6871 43.0463 24.4732 39.8304 21.7111 36.7633C18.949 33.6961 16.3872 30.6495 14.0255 27.6233C11.6638 24.5972 9.56917 21.6275 7.74145 18.7142C5.91374 15.8009 4.43001 13.2928 3.29025 11.1899C2.1505 9.08702 1.35986 7.2457 0.918331 5.66596C0.476804 4.08622 0.230371 3.22967 0.179031 3.09631C0.127691 2.96296 0.112289 2.76293 0.132825 2.49622C0.153361 2.22951 0.189299 2.02947 0.240639 1.89612C0.29198 1.76276 0.374124 1.57812 0.487073 1.34218C0.600021 1.10625 0.723238 0.947248 0.856722 0.865183C0.990207 0.783119 1.14423 0.660022 1.31878 0.495893C1.49334 0.331764 1.67817 0.244571 1.87326 0.234313C2.06835 0.224055 2.26858 0.188151 2.47394 0.126603C2.6793 0.0650546 2.87953 0.0753126 3.07462 0.157377C3.26972 0.239442 3.45967 0.295861 3.6445 0.326635C3.82932 0.357409 4.00388 0.45999 4.16817 0.634377C4.33246 0.808764 4.47621 0.947248 4.59943 1.04983C4.72264 1.15241 4.83046 1.3268 4.92287 1.57299L5.04609 1.84996Z" />
			<path d="M407.04 143.427C407.605 141.18 408.18 139.375 408.765 138.01C409.351 136.646 410.085 135.266 410.968 133.871C411.851 132.476 412.775 131.132 413.74 129.84C414.705 128.547 415.594 127.357 416.405 126.27C417.216 125.183 418.479 123.562 420.194 121.408C421.909 119.253 423.295 117.612 424.352 116.484C425.41 115.355 426.503 114.232 427.633 113.114C428.762 111.996 429.882 110.909 430.991 109.852C432.1 108.795 433.193 107.754 434.271 106.728C435.349 105.703 436.381 104.692 437.367 103.697C438.353 102.702 439.718 101.307 441.464 99.5118C443.21 97.7167 444.575 96.2036 445.561 94.9726C446.547 93.7417 447.512 92.4287 448.457 91.0336C449.401 89.6385 450.402 89.3974 451.46 90.3104C452.518 91.2233 451.891 91.9414 449.581 92.4646C447.271 92.9877 445.361 93.2698 443.851 93.3108C442.342 93.3519 440.684 93.3467 438.877 93.2955C437.069 93.2442 435.077 93.1518 432.901 93.0185C430.724 92.8851 428.326 92.7364 425.708 92.5723C423.089 92.4081 420.132 92.1979 416.836 91.9414C413.54 91.6849 410.208 91.3721 406.84 91.0028C403.472 90.6335 400.14 90.2488 396.844 89.8488C393.548 89.4487 390.247 89.0025 386.941 88.5101C383.634 88.0177 380.343 87.515 377.068 87.0021C373.792 86.4892 370.702 85.9456 367.796 85.3711C364.89 84.7967 361.024 84.0427 356.198 83.1092C351.372 82.1757 348.882 81.6628 348.728 81.5705C348.574 81.4782 348.405 81.3807 348.22 81.2781C348.035 81.1756 347.907 81.0319 347.835 80.8473C347.763 80.6627 347.686 80.4831 347.604 80.3088C347.522 80.1344 347.511 79.9446 347.573 79.7394C347.635 79.5343 347.681 79.3496 347.712 79.1855C347.742 79.0214 347.845 78.8572 348.02 78.6931C348.194 78.529 348.343 78.411 348.466 78.3392C348.589 78.2674 348.774 78.2007 349.021 78.1392C349.267 78.0776 349.457 78.0725 349.591 78.1238C349.724 78.1751 349.909 78.2315 350.145 78.293C350.381 78.3546 350.535 78.4726 350.607 78.6469C350.679 78.8213 350.792 78.9752 350.946 79.1086C351.1 79.2419 351.157 79.4266 351.115 79.6625C351.074 79.8984 351.069 80.0882 351.1 80.2318C351.131 80.3754 351.064 80.5601 350.9 80.7858C350.736 81.0114 350.612 81.1602 350.53 81.232C350.448 81.3038 350.284 81.4064 350.037 81.5397C349.791 81.6731 349.606 81.7141 349.483 81.6628C349.36 81.6115 349.165 81.5961 348.898 81.6167C348.631 81.6372 348.456 81.5602 348.374 81.3858C348.292 81.2115 348.148 81.0832 347.943 81.0012C347.737 80.9191 347.645 80.7498 347.665 80.4934C347.686 80.2369 347.65 80.0523 347.558 79.9395C347.465 79.8266 347.491 79.6317 347.635 79.3548C347.778 79.0778 347.866 78.9085 347.896 78.847C347.927 78.7854 348.066 78.6521 348.312 78.4469C348.559 78.2418 348.733 78.1546 348.836 78.1853C348.939 78.2161 349.129 78.1905 349.406 78.1084C349.683 78.0263 349.781 78.0315 349.698 78.1238C349.616 78.2161 352.009 78.6777 356.876 79.5086C361.743 80.3395 365.588 81.0473 368.412 81.632C371.236 82.2168 374.306 82.704 377.622 83.0938C380.939 83.4836 384.209 83.9093 387.434 84.3709C390.658 84.8326 393.933 85.1659 397.26 85.3711C400.587 85.5763 403.883 85.8173 407.148 86.0943C410.413 86.3713 413.689 86.4944 416.975 86.4636C420.261 86.4328 423.151 86.3867 425.646 86.3251C428.141 86.2636 430.472 86.0789 432.639 85.7712C434.805 85.4634 436.715 85.2378 438.368 85.0941C440.021 84.9505 441.608 84.7505 443.127 84.494C444.647 84.2376 446.398 84.0324 448.38 83.8786C450.361 83.7247 452.364 83.8119 454.386 84.1401C456.409 84.4684 457.503 85.8532 457.667 88.2947C457.831 90.7361 457.544 92.4543 456.805 93.4493C456.065 94.4444 455.187 95.4958 454.171 96.6037C453.154 97.7116 452.066 98.8451 450.906 100.004C449.745 101.163 448.22 102.63 446.331 104.405C444.442 106.18 443.035 107.544 442.111 108.498C441.187 109.452 440.145 110.483 438.984 111.591C437.824 112.699 436.772 113.735 435.827 114.699C434.882 115.663 433.845 116.73 432.716 117.899C431.586 119.069 430.6 120.156 429.758 121.161C428.916 122.167 427.628 123.736 425.893 125.87C424.157 128.004 422.951 129.563 422.273 130.548C421.595 131.532 420.794 132.645 419.87 133.887C418.946 135.128 417.996 136.769 417.021 138.81C416.046 140.852 415.342 142.473 414.911 143.673C414.48 144.873 414.274 145.576 414.295 145.781C414.315 145.986 414.172 146.253 413.863 146.581C413.555 146.909 413.35 147.135 413.247 147.258C413.145 147.381 412.893 147.55 412.493 147.766C412.092 147.981 411.805 148.089 411.63 148.089C411.456 148.089 411.148 148.12 410.706 148.181C410.265 148.243 409.962 148.202 409.797 148.058C409.633 147.915 409.351 147.807 408.95 147.735C408.55 147.663 408.298 147.484 408.196 147.196C408.093 146.909 407.893 146.678 407.595 146.504C407.297 146.33 407.158 146.058 407.179 145.689C407.2 145.319 407.133 145.022 406.979 144.796C406.825 144.57 406.825 144.268 406.979 143.888L407.04 143.427Z" />
		</svg>
	);
}

function hasFormErrors(errors: Record<string, any>) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}

function useFakeEventHandler(when: boolean, cb: () => void) {
	let called = React.useRef(false);
	let cbRef = React.useRef(cb);
	React.useLayoutEffect(() => {
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
