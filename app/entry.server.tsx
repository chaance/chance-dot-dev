import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

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
					console.error("RENDER ERROR: ", error);
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
