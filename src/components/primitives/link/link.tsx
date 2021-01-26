/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import pick from "lodash/pick";
import omit from "lodash/omit";

let nextPropNames = [
	"href",
	"as",
	"replace",
	"scroll",
	"shallow",
	"prefetch",
] as const;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	props,
	ref
) {
	let isExternalLink =
		typeof props.href === "string" && props.href.startsWith("http");
	let rel = props.rel || isExternalLink ? "nofollow noreferrer" : undefined;
	let target = props.target || isExternalLink ? "_blank" : undefined;
	return isExternalLink ? (
		<a
			{...omit(props, nextPropNames)}
			ref={ref}
			href={props.href as string}
			rel={rel}
			target={target}
		/>
	) : (
		<NextLink passHref {...pick(props, nextPropNames)}>
			<a {...omit(props, nextPropNames)} ref={ref} />
		</NextLink>
	);
});

Link.displayName = "Link";

type LinkDOMProps = Omit<
	React.ComponentPropsWithRef<"a">,
	typeof nextPropNames[number]
> &
	Pick<NextLinkProps, typeof nextPropNames[number]>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

export type { LinkDOMProps, LinkOwnProps, LinkProps };
export { Link };
