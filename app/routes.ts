import { remixRoutesOptionAdapter } from "@remix-run/routes-option-adapter";
import type { RouteConfig } from "@remix-run/route-config";
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
