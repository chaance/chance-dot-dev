import * as React from "react";
import { json } from "@remix-run/node";
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
} from "@remix-run/react";
import type { ErrorResponse } from "@remix-run/router";
import { Container } from "~/ui/container";
// import { getSeo } from "~/lib/seo";
import { RouteChangeAnnouncement } from "~/ui/primitives/route-change-announcement";
import { RootProvider } from "~/lib/react/context";
import { useIsHydrated } from "~/lib/react/use-is-hydrated";
import NProgress from "nprogress";

import { PrimaryLayout } from "~/routes/__main";

import "~/styles/resets.css";
import "~/styles/color.css";
import "~/styles/app.css";
import "~/styles/ui.css";
import "~/styles/utility.css";
import "~/styles/prose.css";

const ROOT_CLASS = "layout--root";

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
			sizes: "192x192",
			href: "/app-icons/android-chrome-192x192.png",
		},
		{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
		{ rel: "alternate icon", href: "/favicon.png", type: "image/png" },
		{ rel: "manifest", href: "/manifest.json" },

		{
			rel: "preload",
			as: "font",
			href: "/fonts/armingrotesk-400.woff2",
			type: "font/woff2",
			crossOrigin: "",
		},
	];
}

export async function loader({ request }: LoaderFunctionArgs) {
	let data = {
		requestInfo: {
			origin: getDomainUrl(request),
		},
	};
	return json(data);
}

export default function Root() {
	return (
		<Document>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	meta,
}: React.PropsWithChildren<{ meta?: React.ReactNode }>) {
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
				<RootProvider hydrated={hydrated}>
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

export function ErrorBoundary({ error }: { error: Error }) {
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
						<main className={ROOT_CLASS}>
							<Container>
								<h1 className={`${ROOT_CLASS}__title`}>Oh no!</h1>
								<div className={`${ROOT_CLASS}__message`}>{message}</div>
							</Container>
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
					<main className={ROOT_CLASS}>
						<Container>
							<h1 className={`${ROOT_CLASS}__title`}>Oh no!</h1>
							<div className={`${ROOT_CLASS}__message`}>
								<p>
									Something went wrong and I'm not quite sure what! Maybe go
									outside for a bit and hopefully I'll get it fixed by the time
									you get back.
								</p>
							</div>
						</Container>
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
    }`
				)
			);
			document.head.appendChild(css);

			// Calling getComputedStyle forces the browser to redraw
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _ = window.getComputedStyle(css).opacity;
			document.head.removeChild(css);
		}
	}, []);
}
