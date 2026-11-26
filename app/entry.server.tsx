import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import type {
	EntryContext,
	HandleDataRequestFunction,
	HandleErrorFunction,
} from "react-router";
import { getUserId } from "~/lib/session.server";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

/**
 * Called for errors thrown from loaders, actions and while rendering on the
 * server. Responses thrown on purpose are not errors and don't reach this.
 */
export const handleError: HandleErrorFunction = (error, { request }) => {
	// The browser navigated away or cancelled the request; nothing went wrong
	if (request.signal.aborted) {
		return;
	}
	let url = new URL(request.url);
	console.error(
		`[react-router] Error handling ${request.method} ${url.pathname}${url.search}:`,
		error,
	);
};

/**
 * Pages render differently for a logged-in user (the admin bar, edit links), so
 * they must never be cached and served to anyone else, and a page cached while
 * logged out shouldn't be reused after logging in.
 */
async function setPersonalizedCacheHeaders(request: Request, headers: Headers) {
	if (!/\bcookie\b/i.test(headers.get("Vary") ?? "")) {
		headers.append("Vary", "Cookie");
	}
	if (await getUserId(request)) {
		headers.set("Cache-Control", "private, no-store");
	}
}

export const handleDataRequest: HandleDataRequestFunction = async (
	response,
	{ request },
) => {
	await setPersonalizedCacheHeaders(request, response.headers);
	return response;
};

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
) {
	await setPersonalizedCacheHeaders(request, responseHeaders);

	const callbackName = isbot(request.headers.get("user-agent"))
		? "onAllReady"
		: "onShellReady";

	return new Promise((resolve, reject) => {
		let didError = false;
		let { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={reactRouterContext} url={request.url} />,
			{
				[callbackName]: () => {
					let body = new PassThrough();
					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(createReadableStreamFromReadable(body), {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError: (err: unknown) => {
					reject(err);
				},
				onError: (error: unknown) => {
					didError = true;
					console.error(
						`[react-router] Error rendering ${request.url}:`,
						error,
					);
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
