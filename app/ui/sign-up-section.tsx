import * as React from "react";
import { Text } from "~/ui/text";
import { bem } from "~/lib/utils";
import cx from "clsx";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/ui/primitives/button";
import { SignUpForm, SignUpFormField } from "~/ui/sign-up-form";
import { useIsHydrated } from "~/lib/react/use-is-hydrated";
import type { action as signUpAction } from "~/routes/__main/sign-up";
import { useLayoutEffect } from "~/lib/react/use-layout-effect";

const ROOT_CLASS = "sign-up-section";
const CONVERT_KIT_FORM_ID = "3906586";

function SignUpSection() {
	return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SignUpSection__WIP() {
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

	return (
		<section className={ROOT_CLASS}>
			<div className={bem(ROOT_CLASS, "inner")}>
				<div className={cx(bem(ROOT_CLASS, "body"), "prose prose-tight")}>
					<Text as="Heading" variant="heading-2" color="weaker">
						What am I building?{" "}
						<Text as="div" color="text">
							Join me to stay in the loop.
						</Text>
					</Text>
					<Text>
						I send out infrequent emails—trust me, I hate spam too—with updates
						about Remix, my course Front to Back, and other things that interest
						me.
					</Text>
					<Text>Hopefully they interest you too 🍻</Text>
				</div>
				<div className={bem(ROOT_CLASS, "form")}>
					<div className={bem(ROOT_CLASS, "card")}>
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
											Screen-reader users: do not complete this field or the
											form submission will fail.
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
						{(isHydrated ? formPopupIsVisible : hasSuccessfulSubmission) ? (
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
				</div>
			</div>
		</section>
	);
}

export {
	// SignUpSection__WIP as
	SignUpSection,
};

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasFormErrors(errors: Record<string, any>) {
	let values = Object.values(errors);
	return values.length > 0 && values.some((error) => error != null);
}
