export function json<Data>(
	data: Data,
	init: number | ResponseInit = {},
): Response {
	let responseInit = typeof init === "number" ? { status: init } : init;
	let headers = new Headers(responseInit.headers);
	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json; charset=utf-8");
	}
	return new Response(JSON.stringify(data), {
		...responseInit,
		headers,
	});
}
