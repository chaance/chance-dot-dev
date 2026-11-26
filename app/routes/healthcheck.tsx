// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "~/lib/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
	let host =
		request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

	try {
		let url = new URL("/", `http://${host}`);
		// if we can connect to the database and make a simple query
		// and make a HEAD request to ourselves, then we're good.
		await Promise.all([
			prisma.blogPost.count(),
			fetch(url.toString(), {
				method: "HEAD",
				// Lets the server leave this out of access logs and rate limiting
				headers: { "X-Healthcheck": "true" },
			}).then((r) => {
				if (!r.ok) return Promise.reject(r);
			}),
		]);
		return new Response("OK");
	} catch (error: unknown) {
		console.log("healthcheck ❌", { error });
		return new Response("ERROR", { status: 500 });
	}
}
