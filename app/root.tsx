import * as React from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	ScrollRestoration,
	Scripts,
	useNavigation,
	useFetchers,
	isRouteErrorResponse,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
// import { getSeo } from "~/lib/seo";
import { RouteChangeAnnouncement } from "~/ui/primitives/route-change-announcement";
import { RootProvider } from "~/lib/react/context";
import { useIsHydrated } from "@chance/hooks/use-is-hydrated";
import NProgress from "nprogress";

import { PrimaryLayout } from "~/ui/primary-layout.js";

import fontsStyles from "~/styles/fonts.css?url";
import mediaStyles from "~/styles/media.css?url";
import defsStyles from "~/styles/defs.css?url";
import resetsStyles from "~/styles/resets.css?url";
import appStyles from "~/styles/app.css?url";
import utilsStyles from "~/styles/utils.css?url";
import proseStyles from "~/styles/prose.css?url";
import componentStyles from "~/styles/components.css?url";

export function links() {
	return [
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/app-icons/apple-touch-icon.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "512x512",
			href: "/app-icons/android-chrome-512x512.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "196x196",
			href: "/app-icons/android-chrome-196x196.png",
		},
		{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
		{ rel: "alternate icon", href: "/favicon.png", type: "image/png" },
		{ rel: "manifest", href: "/manifest.json" },
		{
			rel: "preload",
			as: "font",
			href: "/fonts/untitled-sans-light.woff2",
			type: "font/woff2",
			crossOrigin: "",
		},
		{
			rel: "preload",
			as: "font",
			href: "/fonts/untitled-sans-medium.woff2",
			type: "font/woff2",
			crossOrigin: "",
		},
		{
			rel: "preload",
			as: "font",
			href: "/fonts/untitled-sans-light-italic.woff2",
			type: "font/woff2",
			crossOrigin: "",
		},
		{
			rel: "preload",
			as: "font",
			href: "/fonts/untitled-sans-medium-italic.woff",
			type: "font/woff",
			crossOrigin: "",
		},
		{
			rel: "preload",
			as: "font",
			href: "/fonts/editorial-new.ttf",
			type: "font/ttf",
			crossOrigin: "",
		},
		{ rel: "stylesheet", href: fontsStyles },
		{ rel: "stylesheet", href: mediaStyles },
		{ rel: "stylesheet", href: defsStyles },
		{ rel: "stylesheet", href: resetsStyles },
		{ rel: "stylesheet", href: appStyles },
		{ rel: "stylesheet", href: utilsStyles },
		{ rel: "stylesheet", href: proseStyles },
		{ rel: "stylesheet", href: componentStyles },
	];
}

export async function loader({ request }: LoaderFunctionArgs) {
	const currentYear = String(new Date().getFullYear());
	return {
		currentYear,
		requestInfo: {
			origin: getDomainUrl(request),
		},
	};
}

export default function Root() {
	let {
		currentYear,
		requestInfo = {
			origin,
		},
	} = useLoaderData<typeof loader>();
	return (
		<Document currentYear={currentYear} siteUrl={requestInfo.origin}>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	meta,
	currentYear,
	siteUrl,
}: React.PropsWithChildren<{
	meta?: React.ReactNode;
	currentYear?: string;
	siteUrl?: string;
}>) {
	useProgressBar();
	let hydrated = useIsHydrated();

	useDisableTransitionsOnColorSchemeChange();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{meta}
				<Meta />
				<Links />
			</head>
			<body data-hydrated={hydrated ? "" : undefined}>
				<RootProvider
					hydrated={hydrated}
					currentYear={currentYear}
					siteUrl={siteUrl}
				>
					{children}
					<RouteChangeAnnouncement />
					<ScrollRestoration />
					<Scripts />
				</RootProvider>
			</body>
		</html>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return <div className="chance-dot-dev">{children}</div>;
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (process.env.NODE_ENV === "development") {
		console.error("ROOT ERROR BOUNDARY: ", error);
	}

	if (isRouteErrorResponse(error)) {
		let message;
		switch (error.status) {
			case 401:
				message = (
					<p>
						Oops! It looks like you tried to visit a page that you do not have
						access to.
					</p>
				);
				break;
			case 404:
				message = (
					<p>
						Oops! It looks like you tried to visit a page that does not exist.
					</p>
				);
				break;

			default:
				throw new Error(error.data || error.statusText);
		}

		return (
			<Document
				meta={
					<title>
						{`Error ${error.status}: ${error.statusText} | chance.dev`}
					</title>
				}
			>
				<Layout>
					<PrimaryLayout>
						<main>
							<div>
								<h1>Oh no!</h1>
								<div>{message}</div>
							</div>
						</main>
					</PrimaryLayout>
				</Layout>
			</Document>
		);
	}

	return (
		<Document meta={<title>Danger, Will Robinson! 500! | chance.dev</title>}>
			<Layout>
				<PrimaryLayout>
					<main>
						<div>
							<h1>Oh no!</h1>
							<div>
								<p>
									Something went wrong and I'm not quite sure what! Maybe go
									outside for a bit and hopefully I'll get it fixed by the time
									you get back.
								</p>
							</div>
						</div>
					</main>
				</PrimaryLayout>
			</Layout>
		</Document>
	);
}

function getDomainUrl(request: Request) {
	let host =
		request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
	if (!host) {
		throw new Error("Could not determine domain URL.");
	}
	let protocol = host.includes("localhost") ? "http" : "https";
	return `${protocol}://${host}`;
}

function useProgressBar() {
	let navigation = useNavigation();
	let fetchers = useFetchers();
	let state: "idle" | "busy" = React.useMemo(() => {
		let states = [
			navigation.state,
			...fetchers.map((fetcher) => fetcher.state),
		];
		if (states.every((state) => state === "idle")) {
			return "idle";
		}
		return "busy";
	}, [navigation.state, fetchers]);

	let nProgressRef = React.useRef<typeof NProgress | null>(null);
	React.useEffect(() => {
		if (nProgressRef.current === null) {
			nProgressRef.current = NProgress.configure({ showSpinner: false });
		}
	}, []);

	React.useEffect(() => {
		switch (state) {
			case "busy":
				nProgressRef.current?.start();
				break;
			case "idle":
				nProgressRef.current?.done();
				break;
		}
	}, [state]);
}

function useDisableTransitionsOnColorSchemeChange() {
	// Credit for the brilliant technique to Paco Coursey 🖤
	// https://paco.me/writing/disable-theme-transitions
	React.useEffect(() => {
		const darkModeMatches = window.matchMedia("(prefers-color-scheme: dark)");
		darkModeMatches.addEventListener("change", handleColorSchemeChange);
		return () => {
			darkModeMatches.removeEventListener("change", handleColorSchemeChange);
		};

		function handleColorSchemeChange(e: MediaQueryListEvent) {
			const css = document.createElement("style");
			css.type = "text/css";
			css.appendChild(
				document.createTextNode(
					`* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`,
				),
			);
			document.head.appendChild(css);

			// Calling getComputedStyle forces the browser to redraw
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _ = window.getComputedStyle(css).opacity;
			document.head.removeChild(css);
		}
	}, []);
}
