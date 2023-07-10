import * as React from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
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

import appStylesUrl from "~/dist/styles/app.css";
import fontStylesUrl from "~/dist/styles/fonts.css";

const DISABLE_JS = false;
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

		{ rel: "stylesheet", href: fontStylesUrl },
		{ rel: "stylesheet", href: appStylesUrl },
	];
}

export async function loader({ request }: LoaderArgs) {
	let data = {
		requestInfo: {
			origin: getDomainUrl(request),
		},
	};
	return json(data);
}

export function unstable_shouldReload() {
	return false;
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

	// let _loaderData = useLoaderData();
	// let loaderData: LoaderData | null = null;
	// if (_loaderData && isValidLoaderData(_loaderData)) {
	// 	loaderData = _loaderData;
	// }

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
					{!DISABLE_JS ? (
						<React.Fragment>
							<RouteChangeAnnouncement />
							<ScrollRestoration />
							<Scripts />
						</React.Fragment>
					) : null}
				</RootProvider>
			</body>
		</html>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return <div className="chance-dot-dev">{children}</div>;
}

function CatchBoundary({ caught }: { caught: ErrorResponse }) {
	let message;
	switch (caught.status) {
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
			throw new Error(caught.data || caught.statusText);
	}

	return (
		<Document
			meta={
				<title>
					{`Error ${caught.status}: ${caught.statusText} | chance.dev`}
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

export function ErrorBoundary({ error }: { error: Error }) {
	if (process.env.NODE_ENV === "development") {
		console.error("ROOT ERROR BOUNDARY: ", error);
	}

	if (isRouteErrorResponse(error)) {
		return <CatchBoundary caught={error} />;
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
