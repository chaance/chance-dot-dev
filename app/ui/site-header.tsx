import * as React from "react";
import { flushSync } from "react-dom";
import { NavLink } from "@remix-run/react";
import cx from "clsx";
import { SocialNav } from "./social-nav";
import { Button, type ButtonProps } from "./primitives/button.js";
import { useMatchMedia } from "@chance/hooks/use-match-media";
import { useIsHydrated } from "@chance/hooks/use-is-hydrated";
import { useLayoutEffect } from "@chance/hooks/use-layout-effect";
import {
	CollapsibleProvider,
	useCollapsibleContext,
	useCollapsibleContent,
	useCollapsibleTrigger,
} from "~/lib/react/use-collapsible.js";

export function SiteHeader() {
	const isHydrated = useIsHydrated();
	const isMediumScreen = useMatchMedia("(min-width: 768px)", true, {
		effectHook: useLayoutEffect,
	});
	const canUseCollapsible = isHydrated ? !isMediumScreen : false;
	const [navIsOpen, setNavIsOpen] = React.useState(false);
	const Trigger = canUseCollapsible
		? CollapsibleTrigger
		: CollapsibleTriggerNoop;
	const Content = canUseCollapsible
		? CollapsibleContent
		: CollapsibleContentNoop;

	React.useEffect(() => {
		if (!canUseCollapsible) {
			setNavIsOpen(false);
		}
	}, [canUseCollapsible]);

	return (
		<header className="SiteHeader">
			<div className="SiteHeader__inner">
				<CollapsibleProvider isOpen={navIsOpen} onOpenChange={setNavIsOpen}>
					<div className="flex items-center gap-2">
						<Trigger />
					</div>
					<Content />
				</CollapsibleProvider>
			</div>
		</header>
	);
}

interface CollapsibleTriggerProps {}

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
	const ctx = useCollapsibleContext();
	const {
		triggerProps: { onClick, ...triggerProps },
	} = useCollapsibleTrigger();
	return (
		<>
			<HeaderNavButton
				onPress={() => ctx.onOpenChange((prev) => !prev)}
				{...triggerProps}
			/>
			<HeaderLogoLink />
		</>
	);
}

function CollapsibleTriggerNoop(props: CollapsibleTriggerProps) {
	return (
		<>
			<HeaderNavButton aria-hidden aria-disabled />
			<HeaderLogoLink />
		</>
	);
}

interface CollapsibleContentProps {
	className?: string;
}

function CollapsibleContent({ className }: CollapsibleContentProps) {
	const { isOpen } = useCollapsibleContext();
	const [animationState, setAnimationState] = React.useState(
		isOpen ? "open" : "collapsed",
	);

	const ownRef = React.useRef<HTMLDivElement>(null);
	const {
		contentProps: { hidden, ...contentProps },
		ref,
	} = useCollapsibleContent<HTMLDivElement>({}, ownRef);

	// NOTE (Chance 2024-03-27): This can't be derived because if the element is
	// hidden when the user clicks the button, animation will not run and state
	// doesn't get updated. It gets set to `false` in a layout effect to ensure
	// the element is visible before paint, then set to `true` after the closing
	// animation is complete.
	const [isHidden, setIsHidden] = React.useState(!isOpen);
	useLayoutEffect(() => {
		if (isOpen) {
			setIsHidden(false);
		}
	}, [isOpen]);

	return (
		<HeaderNavArea
			data-collapsible=""
			data-animation-state={animationState}
			className={className}
			contentRef={ref}
			{...contentProps}
			aria-hidden={hidden || undefined}
			hidden={isHidden || undefined}
			onAnimationStart={() => {
				setAnimationState(isOpen ? "opening" : "collapsing");
			}}
			onAnimationEnd={(e) => {
				setAnimationState(isOpen ? "open" : "collapsed");
				if (!isOpen) {
					let height = e.currentTarget.style.height;
					e.currentTarget.style.height = "0";
					window.setTimeout(() => {
						ownRef.current && (ownRef.current.style.height = height);
					}, 10);
					setIsHidden(true);
				}
			}}
		/>
	);
}

function CollapsibleContentNoop(props: CollapsibleContentProps) {
	return <HeaderNavArea className="sm-down:hidden" />;
}

interface HeaderNavAreaProps
	extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
	contentRef?: React.Ref<HTMLDivElement>;
}

function HeaderNavArea({
	className,
	contentRef,
	...props
}: HeaderNavAreaProps) {
	return (
		<div
			className={cx("SiteHeader__nav-area", className)}
			{...props}
			ref={contentRef}
		>
			<p className="SiteHeader__desc text-weaker text-sm">
				Developer and open source tinkerer. Surfing the web and the west coast.
			</p>
			<nav className="SiteHeader__nav" aria-label="Main">
				<ul className="SiteHeader__nav-list">
					<li className="SiteHeader__nav-item text-sm">
						<NavLink className="SiteHeader__nav-link" to="/about">
							About
						</NavLink>
					</li>
					{/* <li className="SiteHeader__nav-item text-sm">
						<NavLink className="SiteHeader__nav-link" to="/code-recipes">
							Code Recipes
						</NavLink>
					</li> */}
				</ul>
			</nav>
			<SocialNav />
		</div>
	);
}

function HeaderLogoLink() {
	return (
		<NavLink to="/" className="SiteHeader__title-link">
			<span className="text-h4 sm-down:mt-[4px]">
				Chance <em>the Dev</em>
			</span>
		</NavLink>
	);
}

function HeaderNavButton(
	props: Omit<ButtonProps, "className" | "type" | "children">,
) {
	return (
		<Button className="SiteHeader__nav-toggle" type="button" {...props}>
			<span className="sr-only">Open Menu</span>
			<span className="SiteHeader__nav-toggle-icon" aria-hidden />
		</Button>
	);
}

function useCollapse(ref: React.RefObject<HTMLElement>) {
	const [isCollapsed, setIsCollapsed] = React.useState(false);
	const rafId = React.useRef<number | null>(null);
	const handleTransitionEnd = React.useRef(() => {});
	const stateRef = React.useRef(isCollapsed);
	React.useInsertionEffect(() => {
		stateRef.current = isCollapsed;
	}, [isCollapsed]);

	React.useEffect(() => {
		const element = ref.current;
		return () => {
			window.cancelAnimationFrame(rafId.current!);
			if (element) {
				element.removeEventListener(
					"transitionend",
					handleTransitionEnd.current,
				);
			}
		};
	}, []);

	const collapse = React.useCallback(() => {
		const isCollapsed = stateRef.current;
		const element = ref.current;
		if (!element || isCollapsed) {
			return;
		}
		let sectionHeight = element.scrollHeight;
		let elementTransition = element.style.transition;
		element.style.transition = "";
		rafId.current = window.requestAnimationFrame(() => {
			element.style.height = sectionHeight + "px";
			element.style.transition = elementTransition;
			rafId.current = requestAnimationFrame(() => {
				element.style.height = 0 + "px";
			});
		});
		setIsCollapsed(true);
	}, [ref]);

	const expand = React.useCallback(() => {
		const isCollapsed = stateRef.current;
		const element = ref.current;
		if (!element || !isCollapsed) {
			return;
		}
		let sectionHeight = element.scrollHeight;
		const originalHeight = element.style.height;
		element.style.height = sectionHeight + "px";

		handleTransitionEnd.current = () => {
			element.removeEventListener("transitionend", handleTransitionEnd.current);
			element.style.height = originalHeight;
		};
		element.addEventListener("transitionend", handleTransitionEnd.current);
		setIsCollapsed(false);
	}, [ref]);

	const toggle = React.useCallback(() => {
		const isCollapsed = stateRef.current;
		if (isCollapsed) {
			expand();
		} else {
			collapse();
		}
	}, [expand, collapse]);

	return {
		isCollapsed,
		collapse,
		expand,
		toggle,
	};
}
