// @ts-check
import * as path from "node:path";
import * as fs from "node:fs";
import * as util from "node:util";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import sourceMapSupport from "source-map-support";
import { createStream } from "rotating-file-stream";
import { getRedirectsMiddleware } from "./server/redirects.js";
import getPort from "get-port";

const IS_STAGING = process.env.IS_STAGING === "true";
const IS_DEV = process.env.NODE_ENV === "development";
const IS_PROD = process.env.NODE_ENV === "production" && !IS_STAGING;

sourceMapSupport.install();

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
	"*splat",
	getRedirectsMiddleware({
		redirectsString: fs.readFileSync(
			path.join(import.meta.dirname, "server/_redirects.txt"),
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

if (IS_DEV) {
	console.log(util.styleText("green", "Starting development server 🚀"));
	const viteDevServer = await import("vite").then((vite) =>
		vite.createServer({
			server: {
				middlewareMode: true,
			},
		}),
	);
	app.use(viteDevServer.middlewares);
	app.use(async (req, res, next) => {
		try {
			const source = await viteDevServer.ssrLoadModule("./server/index.ts");
			return await source.app(req, res, next);
		} catch (error) {
			if (error != null && typeof error === "object" && "message" in error) {
				try {
					// @ts-expect-error
					viteDevServer.ssrFixStacktrace(error);
				} catch {}
			}
			next(error);
		}
	});
} else {
	console.log(util.styleText("green", "Starting production server"));
	// Remix fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
	);
	app.use(
		// browser 1 hour, server 1 year
		express.static("build/client", {
			setHeaders: (res) => {
				res.setHeader(
					"Cache-Control",
					"public, max-age=3600, s-maxage=31536000",
				);
			},
		}),
	);

	app.use(
		// this may or may not exist depending on the state of the build
		// @ts-ignore
		await import("./build/server/index.js").then((mod) => mod.app),
	);
}

let accessLogStream;
if (IS_PROD) {
	accessLogStream = createStream("access.log", {
		interval: "1d",
		path: path.join(import.meta.dirname, "log"),
	});
}

app.use(
	morgan("tiny", {
		skip: (req) => req.url === "/healthcheck",
		stream: accessLogStream,
	}),
);

let port;
if (process.env.PORT) {
	port = process.env.PORT;
} else if (IS_DEV) {
	port = await getPort({
		port: Array.from({ length: 10 }, (_, i) => 3000 + i),
	});
} else {
	port = 8080;
}

app.listen(port, () => {
	console.log(
		util.styleText(
			"blue",
			`Express server listening on port ${port} (http://localhost:${port})`,
		),
	);
});
