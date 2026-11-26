import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import type { EntryContext, HandleErrorFunction } from "react-router";
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

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
) {
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
