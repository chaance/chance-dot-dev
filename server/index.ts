import {
	createRequestHandler,
	type RequestHandler,
} from "@react-router/express";
import type { ServerBuild } from "react-router";
import { ip } from "address";
import chalk from "chalk";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import crypto from "crypto";
import express from "express";
import "express-async-errors";
import fs from "fs";
import getPort, { portNumbers } from "get-port";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import sourceMapSupport from "source-map-support";
import { fileURLToPath } from "url";
import { getRedirectsMiddleware } from "./redirects.js";

if (!process.env.SESSION_SECRET) {
	throw new Error("Please define the SESSION_SECRET environment variable");
}

sourceMapSupport.install();

const PRIMARY_HOST = "chance.dev";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MODE = process.env.NODE_ENV;
const IS_STAGING = process.env.IS_STAGING === "true";
const IS_DEV = MODE === "development";
const IS_PROD = MODE === "production" && !IS_STAGING;

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const app = express();

app.use(async (req, res, next) => {
	const host = getHost(req);
	if (!host.endsWith(PRIMARY_HOST)) {
		res.set("X-Robots-Tag", "noindex");
	}
	res.set("Access-Control-Allow-Origin", `https://${host}`);
	res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
	next();
});

app.use((req, res, next) => {
	const proto = req.get("X-Forwarded-Proto");
	const host = getHost(req);
	if (proto === "http") {
		res.set("X-Forwarded-Proto", "https");
		res.redirect(`https://${host}${req.originalUrl}`);
		return;
	}
	next();
});

app.all(
	"*",
	getRedirectsMiddleware({
		redirectsString: fs.readFileSync(here("./_redirects.txt"), "utf8"),
	}),
);

app.use((req, res, next) => {
	if (req.path.endsWith("/") && req.path.length > 1) {
		const query = req.url.slice(req.path.length);
		const safePath = req.path.slice(0, -1).replace(/\/+/g, "/");
		res.redirect(301, safePath + query);
	} else {
		next();
	}
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

const publicAbsolutePath = here("../build/client");

if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	app.use(
		express.static(publicAbsolutePath, {
			maxAge: "1w",
			setHeaders(res, resourcePath) {
				const relativePath = resourcePath.replace(`${publicAbsolutePath}/`, "");
				if (relativePath.startsWith("build/info.json")) {
					res.setHeader("cache-control", "no-cache");
					return;
				}
				// If we ever change our font (which we quite possibly never will)
				// then we'll just want to change the filename or something...
				// Remix fingerprints its assets so we can cache forever
				if (
					relativePath.startsWith("fonts") ||
					relativePath.startsWith("build")
				) {
					res.setHeader("cache-control", "public, max-age=31536000, immutable");
				}
			},
		}),
	);
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(
	morgan(
		(tokens, req, res) => {
			try {
				const host = getHost(req);
				return [
					tokens.method?.(req, res),
					`${host}${decodeURIComponent(tokens.url?.(req, res) ?? "")}`,
					tokens.status?.(req, res),
					tokens.res?.(req, res, "content-length"),
					"-",
					tokens["response-time"]?.(req, res),
					"ms",
				].join(" ");
			} catch (error: unknown) {
				console.error(
					`Error generating morgan log line`,
					error,
					req.originalUrl,
				);
				return "";
			}
		},
		{
			skip: (req, res) => {
				if (res.statusCode !== 200) return false;
				// skip health check related requests
				const headToRoot = req.method === "HEAD" && req.originalUrl === "/";
				const getToHealthCheck =
					req.method === "GET" && req.originalUrl === "/healthcheck";
				return headToRoot || getToHealthCheck;
			},
		},
	),
);

app.use((req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
	next();
});

app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
		contentSecurityPolicy: {
			directives: {
				"connect-src": [
					...(IS_DEV ? ["ws:"] : []),
					...(process.env.SENTRY_DSN ? ["*.ingest.sentry.io"] : []),
					"'self'",
				].filter(Boolean),
				"font-src": ["'self'"],
				"frame-src": [
					"'self'",
					"youtube.com",
					"www.youtube.com",
					"youtu.be",
					"youtube-nocookie.com",
					"www.youtube-nocookie.com",
					"player.simplecast.com",
					"egghead.io",
					"app.egghead.io",
					"calendar.google.com",
					"codesandbox.io",
					"share.transistor.fm",
					"codepen.io",
				],
				"img-src": [
					"'self'",
					"data:",
					"res.cloudinary.com",
					"www.gravatar.com",
					"cdn.usefathom.com",
					"pbs.twimg.com",
					"i.ytimg.com",
					"image.simplecastcdn.com",
					"images.transistor.fm",
					"i2.wp.com",
					"i1.wp.com",
					"og-image-react-egghead.now.sh",
					"og-image-react-egghead.vercel.app",
					"www.epicweb.dev",
					...(IS_DEV ? ["cloudflare-ipfs.com"] : []),
				],
				"media-src": [
					"'self'",
					"res.cloudinary.com",
					"data:",
					"blob:",
					"www.dropbox.com",
					"*.dropboxusercontent.com",
				],
				"script-src": [
					"'strict-dynamic'",
					"'unsafe-eval'",
					"'self'",
					"cdn.usefathom.com",
					// @ts-expect-error middleware is the worst
					(req, res) => `'nonce-${res.locals.cspNonce}'`,
				],
				"script-src-attr": [
					"'unsafe-inline'",
					// TODO: figure out how to make the nonce work instead of
					// unsafe-inline. I tried adding a nonce attribute where we're using
					// inline attributes, but that didn't work. I still got that it
					// violated the CSP.
				],
				"upgrade-insecure-requests": null,
			},
		},
	}),
);

async function getRequestHandler(): Promise<RequestHandler> {
	function getLoadContext(req: any, res: any) {
		return { cspNonce: res.locals.cspNonce };
	}
	if (IS_PROD) {
		const build = await getBuild();
		return createRequestHandler({
			build,
			getLoadContext,
			mode: MODE,
		});
	}
	return createRequestHandler({
		build: getBuild,
		getLoadContext,
		mode: MODE,
	});
}

app.all("*", await getRequestHandler());

const desiredPort = Number(process.env.PORT || 3000);
const portToUse = await getPort({
	port: portNumbers(desiredPort, desiredPort + 100),
});

const server = app.listen(portToUse, () => {
	const addy = server.address();
	const portUsed =
		desiredPort === portToUse
			? desiredPort
			: addy && typeof addy === "object"
				? addy.port
				: 0;

	if (portUsed !== desiredPort) {
		console.warn(
			chalk.yellow(
				`⚠️  Port ${desiredPort} is not available, using ${portUsed} instead.`,
			),
		);
	}
	console.log(`\n🐨  let's get rolling!`);
	const localUrl = `http://localhost:${portUsed}`;
	let lanUrl: string | null = null;
	const localIp = ip();
	// Check if the address is a private ip
	// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
	// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
	if (
		localIp &&
		/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)
	) {
		lanUrl = `http://${localIp}:${portUsed}`;
	}

	console.log(
		`
${chalk.bold("Local:")}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold("On Your Network:")}  ${chalk.cyan(lanUrl)}` : ""}
${chalk.bold("Press Ctrl+C to stop")}
		`.trim(),
	);
});

closeWithGrace(() => {
	return new Promise<string>((resolve, reject) => {
		server.close((e) => (e ? reject(e) : resolve("ok")));
	});
});

async function getBuild(): Promise<ServerBuild> {
	if (viteDevServer) {
		return viteDevServer.ssrLoadModule(
			"virtual:react-router/server-build",
		) as any;
	}
	// @ts-ignore (this file may or may not exist yet)
	return import("../build/server/index.js") as Promise<ServerBuild>;
}

function here(...d: Array<string>) {
	return path.join(__dirname, ...d);
}

function getHost(req: { get: (key: string) => string | undefined }) {
	return req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
}
