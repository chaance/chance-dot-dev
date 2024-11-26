import { defineConfig, splitVendorChunkPlugin } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		arraybuffer(),
		remix({
			ignoredRouteFiles: ["**/*"],
			future: {
				v3_fetcherPersist: true,
				v3_lazyRouteDiscovery: true,
				v3_relativeSplatPath: true,
				v3_routeConfig: true,
				v3_singleFetch: true,
				v3_throwAbortReason: true,
			},
		}),
	],
});

declare module "@remix-run/server-runtime" {
	interface Future {
		v3_singleFetch: true;
	}
}
