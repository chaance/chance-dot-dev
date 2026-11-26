// @ts-check
import * as path from "node:path";
import * as fs from "node:fs";
import * as util from "node:util";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import sourceMapSupport from "source-map-support";
import { getRedirectsMiddleware } from "./server/redirects.js";
import getPort from "get-port";

const IS_DEV = process.env.NODE_ENV === "development";

sourceMapSupport.install();

// Log crashes before the process exits so they show up in `fly logs`
process.on("unhandledRejection", (reason) => {
	console.error("[server] Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (error, origin) => {
	console.error(`[server] Uncaught exception (${origin}):`, error);
	process.exit(1);
});

const app = express();

/**
 * Get the visitor's IP address. Requests reach us through Fly's proxy, so
 * `req.ip` is the proxy's address and is shared by every visitor. Fly puts the
 * real client address in the `Fly-Client-IP` header.
 * https://fly.io/docs/networking/request-headers/#fly-client-ip
 */
function getClientIp(/** @type {express.Request} */ req) {
	return req.get("fly-client-ip") || req.ip || "unknown";
}

/** The health check route requests the home page to make sure it renders */
function isHealthcheckRequest(/** @type {express.Request} */ req) {
	return req.get("x-healthcheck") === "true";
}

// Only applied to requests handled by React Router (documents, `.data` and
// `/__manifest` requests). Static assets and the health check don't count.
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 1000,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
	skip: (req) => req.path === "/healthcheck" || isHealthcheckRequest(req),
	handler: (req, res, _next, options) => {
		console.warn(
			`[rate-limit] ${getClientIp(req)} exceeded ${options.limit} requests per ${options.windowMs / 1000}s: ${req.method} ${req.originalUrl}`,
		);
		res.status(options.statusCode).send(options.message);
	},
});

// Access log to stdout. This runs before any routes so every request is logged.
morgan.token("client-ip", (req) => getClientIp(/** @type {any} */ (req)));
app.use(
	morgan(
		IS_DEV
			? "dev"
			: ":client-ip :method :url :status :res[content-length] - :response-time ms",
		{
			skip: (req, res) => {
				// `req.url` is rewritten inside mounted middleware like `/assets`
				let url = /** @type {express.Request} */ (req).originalUrl || "";
				return (
					url === "/healthcheck" ||
					isHealthcheckRequest(/** @type {express.Request} */ (req)) ||
					// Only log errors for static files (and Vite's dev modules) to keep
					// the noise down
					(/^\/(assets|fonts|img|images|app-icons|favicon|@|app\/|node_modules\/)/.test(
						url,
					) &&
						res.statusCode < 400)
				);
			},
		},
	),
);

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
	app.use(limiter);
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

	app.use(limiter);
	app.use(
		// this may or may not exist depending on the state of the build
		// @ts-ignore
		await import("./build/server/index.js").then((mod) => mod.app),
	);
}

// Errors that escape the request handlers
app.use(
	(
		/** @type {unknown} */ error,
		/** @type {express.Request} */ req,
		/** @type {express.Response} */ res,
		/** @type {express.NextFunction} */ next,
	) => {
		console.error(
			`[server] Unhandled error for ${req.method} ${req.originalUrl}:`,
			error,
		);
		if (res.headersSent) {
			return next(error);
		}
		res.status(500).send("Internal Server Error");
	},
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
