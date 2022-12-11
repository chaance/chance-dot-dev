// const { getDependenciesToBundle } = require("@remix-run/dev");
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
	cacheDirectory: "./node_modules/.cache/remix",
	ignoredRouteFiles: [
		"**/.*",
		"**/*.css",
		"**/*.scss",
		"**/ui/**/*",
		"**/*.test.{js,jsx,ts,tsx}",
	],
	// serverDependenciesToBundle: [
	// 	...getDependenciesToBundle(
	// 		// "hast",
	// 		// "unist",
	// 		"unified",
	// 		"remark-gfm",
	// 		"remark-parse",
	// 		"remark-rehype",
	// 		"rehype-slug",
	// 		"rehype-stringify",
	// 		"escape-goat",
	// 		"unist-util-visit"
	// 	),
	// ],
};
