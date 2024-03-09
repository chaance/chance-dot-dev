import { defineConfig, splitVendorChunkPlugin } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import { createRoutesFromFolders } from "./remix.routes.mjs";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		arraybuffer(),
		remix({
			ignoredRouteFiles: ["**/*"],
			routes: async (defineRoutes) => {
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
		}),
	],
});
