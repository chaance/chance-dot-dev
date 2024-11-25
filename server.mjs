import * as path from "node:path";
import * as fs from "node:fs";
import * as url from "node:url";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import rateLimit from "express-rate-limit";
import sourceMapSupport from "source-map-support";
import { installGlobals } from "@remix-run/node";
import { createStream } from "rotating-file-stream";
import { getRedirectsMiddleware } from "./server/redirects.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const MODE = process.env.NODE_ENV;
const STAGING = process.env.IS_STAGING === "true";
const IS_DEV = MODE === "development";
const IS_PROD = MODE === "production" && !STAGING;

sourceMapSupport.install();
installGlobals();

const viteDevServer = IS_DEV
	? await import("vite").then((vite) =>
			vite.createServer({
				server: { middlewareMode: true },
			}),
		)
	: undefined;

const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 1000,
	standardHeaders: true,
	legacyHeaders: false,
});

// app.set("trust proxy", true);
app.use(limiter);

app.all(
	"*",
	getRedirectsMiddleware({
		redirectsString: fs.readFileSync(
			path.join(__dirname, "server/_redirects.txt"),
			"utf8",
		),
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

if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Remix fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
	);
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

/** @type {import("rotating-file-stream").RotatingFileStream | undefined} */
let accessLogStream;
if (IS_PROD) {
	accessLogStream = createStream("access.log", {
		interval: "1d",
		path: path.join(__dirname, "log"),
	});
}

app.use(
	morgan("tiny", {
		skip: (req) => req.url === "/healthcheck",
		stream: accessLogStream,
	}),
);

app.all(
	"*",
	createRequestHandler({
		build: viteDevServer
			? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
			: // this may or may not exist depending on the state of the build
				// @ts-ignore
				await import("./build/server/index.js"),
		mode: process.env.NODE_ENV,
	}),
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(
		`Express server listening on port ${port} (http://localhost:${port})`,
	);
});

/**
 * @typedef {import("path-to-regexp").Key} Key
 * @typedef {import("express").RequestHandler} RequestHandler
 */
