import React from "react";
import { useId } from "@reach/auto-id";

export const SVG = React.forwardRef<SVGSVGElement, SVGProps>(function SVG(
	{ children, title, titleId: titleIdProp, ...props },
	ref
) {
	let _titleId = useId(titleIdProp);
	let titleId = titleIdProp || `svg-${_titleId}`;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			aria-labelledby={titleId || _titleId}
			role="img"
			ref={ref}
			{...props}
		>
			<title id={titleId || _titleId}>{title}</title>
			{children}
		</svg>
	);
});

type SVGDOMProps = React.ComponentPropsWithRef<"svg">;
type SVGOwnProps = {
	title?: string;
	titleId?: string;
};
type SVGProps = SVGDOMProps & SVGOwnProps;

export const TwitterIcon = makeIcon(
	{
		size: 20,
		title: "Twitter Icon",
		viewBox: "0 0 17 17",
		displayName: "TwitterIcon",
	},
	<path d="M16.5,1.83a6.89,6.89,0,0,1-2.18.88,3.43,3.43,0,0,0-2.55-1.12A3.49,3.49,0,0,0,8.28,5.06h0a5.31,5.31,0,0,0,.07.81A9.89,9.89,0,0,1,1.18,2.21,3.88,3.88,0,0,0,.68,4,3.62,3.62,0,0,0,2.24,6.87,3.26,3.26,0,0,1,.69,6.43v.06a3.51,3.51,0,0,0,2.8,3.42,4.94,4.94,0,0,1-.94.12l-.62,0a3.47,3.47,0,0,0,3.24,2.43A7.32,7.32,0,0,1,.81,13.89L0,13.84A10,10,0,0,0,5.36,15.4a9.83,9.83,0,0,0,9.9-9.77V5A6.48,6.48,0,0,0,17,3.19a6.35,6.35,0,0,1-2,.56,3.27,3.27,0,0,0,1.5-1.93" />
);

export const GithubIcon = makeIcon(
	{
		size: 20,
		title: "GitHub Icon",
		viewBox: "0 0 17 17",
		displayName: "GithubIcon",
	},
	<path d="M8.5.7A8,8,0,0,0,6,16.29c.4.07.55-.17.55-.38s0-.82,0-1.49c-2,.37-2.53-.49-2.69-.94A2.91,2.91,0,0,0,3,12.35c-.28-.15-.68-.52,0-.53a1.6,1.6,0,0,1,1.23.82,1.71,1.71,0,0,0,2.33.66,1.68,1.68,0,0,1,.51-1.07c-1.78-.2-3.64-.89-3.64-4a3.11,3.11,0,0,1,.82-2.15A2.87,2.87,0,0,1,4.32,4s.67-.21,2.2.82a7.54,7.54,0,0,1,4,0c1.53-1,2.2-.82,2.2-.82a2.87,2.87,0,0,1,.08,2.12,3.1,3.1,0,0,1,.82,2.15c0,3.07-1.87,3.75-3.65,4a1.89,1.89,0,0,1,.54,1.48c0,1.07,0,1.93,0,2.2s.15.46.55.38A8,8,0,0,0,8.5.7Z" />
);

export const MoonIcon = makeIcon(
	{
		size: 20,
		title: "Moon",
		displayName: "MoonIcon",
		viewBox: "0 0 100 100",
	},
	<path d="M50,0c-1.0191,0-2.0284.04-3.0323.1A44.1321,44.1321,0,1,1,.1,46.9677C.04,47.9717,0,48.981,0,50A50,50,0,1,0,50,0Z" />
);

function makeIcon(
	{
		size,
		title,
		viewBox,
		displayName,
		"aria-hidden": ariaHidden,
	}: {
		size: number;
		title: string;
		viewBox: string;
		displayName: string;
		"aria-hidden"?: boolean;
	},
	children: React.ReactElement
) {
	const Comp = React.forwardRef<SVGSVGElement, SVGProps>(function (props, ref) {
		return (
			<SVG
				ref={ref}
				width={size}
				height={size}
				viewBox={viewBox}
				title={title}
				aria-hidden={ariaHidden || undefined}
				{...props}
			>
				{children}
			</SVG>
		);
	});
	Comp.displayName = displayName;
	return Comp;
}
