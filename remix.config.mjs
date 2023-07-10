import { createRoutesFromFolders } from "./remix.routes.mjs";

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const config = {
	// TODO: change this to "esm" when it's ready
	serverModuleFormat: "cjs",
	ignoredRouteFiles: ["**/*"],
	routes: (defineRoutes) => {
		return createRoutesFromFolders(defineRoutes, {
			ignoredFilePatterns: [
				"**/.*",
				"**/*.css",
				"**/*.scss",
				"**/ui/**/*",
				"**/*.test.{js,jsx,ts,tsx}",
			],
		});
	},
	cacheDirectory: "./node_modules/.cache/remix",
	future: {
		v2_headers: true,
		v2_meta: true,
		v2_errorBoundary: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
		v2_dev: true,
	},
};

export default config;
