import * as React from "react";

export const SVG = React.forwardRef<SVGSVGElement, SVGProps>(
	(
		{
			children,
			title,
			titleId: titleIdProp,
			"aria-hidden": ariaHidden,
			...props
		},
		ref
	) => {
		let titleId = titleIdProp; /* || `svg-${_titleId}`; */

		ariaHidden = ariaHidden === true || ariaHidden === "true";

		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				{...(ariaHidden
					? { "aria-hidden": true }
					: {
							"aria-labelledby": titleId,
							role: "img",
					  })}
				ref={ref}
				{...props}
			>
				{title ? <title id={titleId}>{title}</title> : null}
				{children}
			</svg>
		);
	}
);
SVG.displayName = "SVG";

type SVGDOMProps = React.ComponentPropsWithRef<"svg">;
type SVGOwnProps = {
	title?: string | null;
	titleId?: string;
};
type SVGProps = SVGDOMProps & SVGOwnProps;

export const TwitterIcon = makeIconComponent(
	{
		size: 20,
		title: "Twitter",
		viewBox: "0 0 17 17",
		displayName: "TwitterIcon",
	},
	<path d="M16.5,1.83a6.89,6.89,0,0,1-2.18.88,3.43,3.43,0,0,0-2.55-1.12A3.49,3.49,0,0,0,8.28,5.06h0a5.31,5.31,0,0,0,.07.81A9.89,9.89,0,0,1,1.18,2.21,3.88,3.88,0,0,0,.68,4,3.62,3.62,0,0,0,2.24,6.87,3.26,3.26,0,0,1,.69,6.43v.06a3.51,3.51,0,0,0,2.8,3.42,4.94,4.94,0,0,1-.94.12l-.62,0a3.47,3.47,0,0,0,3.24,2.43A7.32,7.32,0,0,1,.81,13.89L0,13.84A10,10,0,0,0,5.36,15.4a9.83,9.83,0,0,0,9.9-9.77V5A6.48,6.48,0,0,0,17,3.19a6.35,6.35,0,0,1-2,.56,3.27,3.27,0,0,0,1.5-1.93" />
);

export const MastodonIcon = makeIconComponent(
	{
		size: 20,
		title: "Mastodon",
		viewBox: "0 0 26 26",
		displayName: "MastodonIcon",
	},
	<path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M18.1055 19.817C21.3293 19.428 24.1363 17.4208 24.4891 15.5867C25.045 12.6976 24.9991 8.53621 24.9991 8.53621C24.9991 2.89602 21.3422 1.24279 21.3422 1.24279C19.4984 0.387042 16.3322 0.0271756 13.0429 0H12.962C9.67265 0.0271756 6.50858 0.387042 4.66462 1.24279C4.66462 1.24279 1.00761 2.89602 1.00761 8.53621C1.00761 8.87814 1.00586 9.23779 1.00404 9.61219C0.998981 10.652 0.993371 11.8056 1.02313 13.0097C1.15593 18.5255 2.02385 23.9616 7.07056 25.3114C9.39748 25.9338 11.3953 26.064 13.0043 25.9747C15.9222 25.8112 17.5602 24.9224 17.5602 24.9224L17.464 22.7831C17.464 22.7831 15.3788 23.4475 13.037 23.3665C10.7169 23.2861 8.26757 23.1137 7.89232 20.2352C7.85766 19.9823 7.84033 19.712 7.84033 19.428C7.84033 19.428 10.1179 19.9906 13.0043 20.1242C14.7693 20.206 16.4244 20.0197 18.1055 19.817ZM20.6856 15.8031V8.97377C20.6856 7.57801 20.3339 6.46886 19.6276 5.64827C18.899 4.82768 17.945 4.40701 16.7609 4.40701C15.3906 4.40701 14.353 4.93918 13.6671 6.00365L13 7.1334L12.3331 6.00365C11.6471 4.93918 10.6095 4.40701 9.23932 4.40701C8.05506 4.40701 7.10106 4.82768 6.3726 5.64827C5.66617 6.46886 5.31449 7.57801 5.31449 8.97377V15.8031H7.99199V9.17451C7.99199 7.77721 8.57379 7.06798 9.73753 7.06798C11.0242 7.06798 11.6692 7.9093 11.6692 9.5729V13.2011H14.3309V9.5729C14.3309 7.9093 14.9758 7.06798 16.2625 7.06798C17.4262 7.06798 18.0081 7.77721 18.0081 9.17451V15.8031H20.6856Z"
	/>
);

export const DiscordIcon = makeIconComponent(
	{
		size: 20,
		title: "Discord",
		viewBox: "0 0 28 28",
		displayName: "DiscordIcon",
	},
	<path d="M25.732 9.40936C25.956 8.84936 26.684 6.62336 25.494 3.61336C25.494 3.61336 23.66 3.06736 19.474 5.86736C17.724 5.40536 15.862 5.33536 14 5.33536C12.152 5.33536 10.276 5.40536 8.526 5.86736C4.34 3.02536 2.506 3.61336 2.506 3.61336C1.316 6.62336 2.044 8.84936 2.282 9.40936C0.854 10.9354 0 12.8674 0 15.2754C0 24.2914 5.824 26.3214 14 26.3214C22.106 26.3214 28 24.2914 28 15.2754C28 12.8674 27.146 10.9354 25.732 9.40936M14 24.5994C8.232 24.5994 3.542 24.3334 3.542 18.7334C3.542 17.4034 4.2 16.1434 5.32 15.1214C7.196 13.3994 10.402 14.3094 14 14.3094C17.626 14.3094 20.79 13.3994 22.68 15.1214C23.8 16.1434 24.5 17.3894 24.5 18.7334C24.5 24.3194 19.782 24.5994 14 24.5994ZM9.604 15.8354C8.456 15.8354 7.504 17.2354 7.504 18.9434C7.504 20.6654 8.456 22.0794 9.604 22.0794C10.766 22.0794 11.704 20.6794 11.704 18.9434C11.704 17.2214 10.766 15.8354 9.604 15.8354M18.396 15.8354C17.234 15.8354 16.296 17.2214 16.296 18.9434C16.296 20.6794 17.234 22.0794 18.396 22.0794C19.544 22.0794 20.496 20.6794 20.496 18.9434C20.496 17.2214 19.6 15.8354 18.396 15.8354Z" />
);

export const GitHubIcon = makeIconComponent(
	{
		size: 20,
		title: "GitHub",
		viewBox: "0 0 17 17",
		displayName: "GitHubIcon",
	},
	<path d="M8.5.7A8,8,0,0,0,6,16.29c.4.07.55-.17.55-.38s0-.82,0-1.49c-2,.37-2.53-.49-2.69-.94A2.91,2.91,0,0,0,3,12.35c-.28-.15-.68-.52,0-.53a1.6,1.6,0,0,1,1.23.82,1.71,1.71,0,0,0,2.33.66,1.68,1.68,0,0,1,.51-1.07c-1.78-.2-3.64-.89-3.64-4a3.11,3.11,0,0,1,.82-2.15A2.87,2.87,0,0,1,4.32,4s.67-.21,2.2.82a7.54,7.54,0,0,1,4,0c1.53-1,2.2-.82,2.2-.82a2.87,2.87,0,0,1,.08,2.12,3.1,3.1,0,0,1,.82,2.15c0,3.07-1.87,3.75-3.65,4a1.89,1.89,0,0,1,.54,1.48c0,1.07,0,1.93,0,2.2s.15.46.55.38A8,8,0,0,0,8.5.7Z" />
);

export const LinkedInIcon = makeIconComponent(
	{
		size: 20,
		title: "LinkedIn",
		viewBox: "0 0 310 310",
		displayName: "LinkedInIcon",
	},
	<path d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z" />
);

export const MoonIcon = makeIconComponent(
	{
		size: 20,
		title: "Moon",
		displayName: "MoonIcon",
		viewBox: "0 0 100 100",
	},
	<path d="M50,0c-1.0191,0-2.0284.04-3.0323.1A44.1321,44.1321,0,1,1,.1,46.9677C.04,47.9717,0,48.981,0,50A50,50,0,1,0,50,0Z" />
);

export const CloseIcon = makeIconComponent(
	{
		size: 20,
		title: "Close",
		displayName: "CloseIcon",
		viewBox: "0 0 20 20",
	},
	<path
		fillRule="evenodd"
		d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
		clipRule="evenodd"
	/>
);

export const GearIcon = makeIconComponent(
	{
		size: 20,
		title: "Gear",
		displayName: "GearIcon",
		viewBox: "0 0 20 20",
	},

	<path
		fillRule="evenodd"
		d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
		clipRule="evenodd"
	/>
);

export const CheckIcon = makeIconComponent(
	{
		size: 20,
		title: "Check",
		displayName: "CheckIcon",
		viewBox: "0 0 20 20",
	},
	<path
		fillRule="evenodd"
		d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
		clipRule="evenodd"
	/>
);

export const GlobeIcon = makeIconComponent(
	{
		size: 24,
		title: "Globe",
		displayName: "GlobeIcon",
		viewBox: "0 0 24 24",
		strokeWidth: 2,
		stroke: "currentColor",
		fill: "none",
	},

	<path
		strokeLinecap="round"
		strokeLinejoin="round"
		d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
	/>
);

export const BriefcaseIcon = makeIconComponent(
	{
		size: 24,
		title: "Briefcase",
		displayName: "BriefcaseIcon",
		viewBox: "0 0 24 24",
		strokeWidth: 2,
		stroke: "currentColor",
		fill: "none",
	},
	<path
		strokeLinecap="round"
		strokeLinejoin="round"
		d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
	/>
);

export function makeIconComponent(
	{
		size,
		title,
		viewBox,
		displayName,
		fill = "currentColor",
		...otherProps
	}: {
		size: number;
		title: string;
		viewBox: string;
		displayName: string;
	} & React.ComponentPropsWithoutRef<"svg">,
	children: React.ReactElement
) {
	const Comp = React.forwardRef<SVGSVGElement, SVGProps>(
		({ title: titleProp, ...props }, ref) => {
			return (
				<SVG
					ref={ref}
					width={size}
					height={size}
					viewBox={viewBox}
					title={titleProp === null ? undefined : titleProp || title}
					fill={fill}
					{...otherProps}
					{...props}
				>
					{children}
				</SVG>
			);
		}
	);
	Comp.displayName = displayName;
	return Comp;
}
