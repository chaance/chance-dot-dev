import { defineConfig, splitVendorChunkPlugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		arraybuffer(),
		reactRouter(),
	],
});
