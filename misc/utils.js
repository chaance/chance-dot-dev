// https://github.com/kentcdodds/kentcdodds.com/blob/main/other/utils.js
// (c) Kent C. Dodds GPL v3
const hostname =
	process.env.GITHUB_REF_NAME === "dev"
		? "chance-dot-dev-a71c-staging.fly.dev"
		: "chance.dev";

/**
 *
 * @param {{
 * 	http?: typeof import("http");
 * 	options?: import("http").RequestOptions;
 * 	postData: any;
 * }} params
 * @returns
 */
export async function postRefreshCache({
	http,
	postData,
	options: { headers: headersOverrides, ...optionsOverrides } = {},
}) {
	if (!http) {
		http = await import("https");
	}
	return new Promise((resolve, reject) => {
		try {
			const postDataString = JSON.stringify(postData);
			const options = {
				hostname,
				port: 443,
				path: `/action/refresh-cache`,
				method: "POST",
				headers: {
					auth: process.env.REFRESH_CACHE_SECRET,
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(postDataString),
					...headersOverrides,
				},
				...optionsOverrides,
			};

			const req = http
				.request(options, (res) => {
					let data = "";
					res.on("data", (d) => {
						data += d;
					});

					res.on("end", () => {
						try {
							resolve(JSON.parse(data));
						} catch (error) {
							reject(data);
						}
					});
				})
				.on("error", reject);
			req.write(postDataString);
			req.end();
		} catch (error) {
			console.log("oh no", error);
			reject(error);
		}
	});
}
