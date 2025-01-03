import * as React from "react";
import {
	Link as ReactRouterLink,
	NavLink as ReactRouterNavLink,
} from "react-router";
import type {
	LinkProps as ReactRouterLinkProps,
	NavLinkProps as ReactRouterNavLinkProps,
} from "react-router";
import { isAbsoluteUrl, isFunction, isString } from "~/lib/utils";

function makeLink(
	Component: typeof ReactRouterLink | typeof ReactRouterNavLink,
	displayName: string,
) {
	type P = typeof Component extends typeof ReactRouterNavLink
		? NavLinkProps
		: LinkProps;

	const Link = React.forwardRef<HTMLAnchorElement, P>((props, ref) => {
		if (isString(props.to) && isAbsoluteUrl(props.to)) {
			let { caseSensitive, className, end, style, children, ...domProps } =
				props as NavLinkProps;
			style = isFunction(style)
				? style({ isActive: false, isPending: false, isTransitioning: false })
				: style;
			className = isFunction(className)
				? className({
						isActive: false,
						isPending: false,
						isTransitioning: false,
					})
				: className;
			children = isFunction(children)
				? children({
						isActive: false,
						isPending: false,
						isTransitioning: false,
					})
				: children;

			return (
				<a
					{...domProps}
					data-type="absolute"
					className={className}
					style={style}
					ref={ref}
					href={props.to}
				>
					{children}
				</a>
			);
		}

		// @ts-ignore
		return (
			<Component {...props} data-type={displayName.toLowerCase()} ref={ref} />
		);
	});
	Link.displayName = displayName;
	return Link;
}

const Link = makeLink(ReactRouterLink, "Link");
const NavLink = makeLink(ReactRouterNavLink, "NavLink");

interface LinkProps extends ReactRouterLinkProps {}
interface NavLinkProps extends ReactRouterNavLinkProps {}

export type { LinkProps, NavLinkProps };
export { Link, NavLink };
