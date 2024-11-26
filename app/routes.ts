import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import type { RouteConfig } from "@react-router/dev/routes";
import { createRoutesFromFolders } from "./remix.routes.ts";

export default remixRoutesOptionAdapter(async (defineRoutes) => {
	return createRoutesFromFolders(defineRoutes, {
		ignoredFilePatterns: [
			"**/.*",
			"**/*.css",
			"**/*.scss",
			"**/__features/**/*",
			"**/__features/**/*",
			"**/*.test.{js,jsx,ts,tsx}",
		],
	});
}) satisfies RouteConfig;
