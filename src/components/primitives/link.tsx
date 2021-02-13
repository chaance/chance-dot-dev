/* eslint-disable react/jsx-no-target-blank, jsx-a11y/anchor-has-content */
import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { isLocalURL } from "next/dist/next-server/lib/router/router";

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{ as, href: hrefProp, replace, scroll, shallow, prefetch, ...props },
	ref
) {
	// next/link already does something like this, but it also does a lot more in
	// render we can avoid by checking first and using a plain anchor for external
	// links.
	let isExternalLink = typeof hrefProp === "string" && !isLocalURL(hrefProp);

	return isExternalLink ? (
		<a
			// rel={isExternalLink ? "nofollow noreferrer" : undefined}
			// target={isExternalLink ? "_blank" : undefined}
			{...props}
			ref={ref}
			href={hrefProp as string}
		/>
	) : (
		<NextLink
			passHref
			as={as}
			replace={replace}
			scroll={scroll}
			shallow={shallow}
			prefetch={prefetch}
			href={hrefProp}
		>
			<a {...props} ref={ref} />
		</NextLink>
	);
});

Link.displayName = "Link";

type NextPropNames =
	| "href"
	| "as"
	| "replace"
	| "scroll"
	| "shallow"
	| "prefetch";

export type { LinkDOMProps, LinkOwnProps, LinkProps };
export { Link };

type LinkDOMProps = Omit<React.ComponentPropsWithRef<"a">, NextPropNames> &
	Pick<NextLinkProps, NextPropNames>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;
