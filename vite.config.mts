import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import arraybuffer from "vite-plugin-arraybuffer";
import dotenv from "dotenv";
import { Features } from "lightningcss";

const testEnv = dotenv.parse(
	fs.readFileSync(path.resolve(import.meta.dirname, ".env.example")),
);

// We don't need to load `reactRouter` in storybook or tests,
// but we need to load `react`.
const shouldLoadReactRouter = !process.env.VITEST;

export default defineConfig({
	css: {
		transformer: "lightningcss",
		lightningcss: {
			drafts: { customMedia: true },
			exclude: Features.LightDark,
		},
	},
	environments: {
		ssr: {
			build: {
				rolldownOptions: { input: "./server/index.ts" },
			},
		},
	},
	server: shouldLoadReactRouter
		? // This should fix a bug in React Router that causes the dev server to crash
			// on the first page load after clearing node_modules. Remove this when the
			// issue is fixed.
			// https://github.com/remix-run/react-router/issues/12786#issuecomment-2634033513
			{ warmup: { clientFiles: ["./app/root.tsx"] } }
		: undefined,
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		globalCustomMedia(
			path.resolve(import.meta.dirname, "app/styles/media.css"),
		),
		arraybuffer(),
		shouldLoadReactRouter ? reactRouter() : react(),
	],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./test/setup-test-env.ts"],
		env: testEnv,
	},
	optimizeDeps: {
		exclude: ["virtual:react-router/server-build"],
	},
});

/**
 * Makes the `@custom-media` definitions in `mediaFile` available to every
 * stylesheet in the app by prepending an `@import` of it. Lightning CSS shares
 * custom media definitions across a bundle and drops them from the output, so
 * the import itself adds no CSS.
 */
function globalCustomMedia(mediaFile: string): Plugin {
	let appDir = path.dirname(path.dirname(mediaFile));
	return {
		name: "global-custom-media",
		enforce: "pre",
		transform: {
			filter: { id: /\.css(?:$|\?)/ },
			handler(code, id) {
				let [file, query = ""] = id.split("?", 2);
				if (file === mediaFile || !file.startsWith(appDir + path.sep)) {
					return;
				}
				// `?url` and `?raw` imports are JS modules wrapping the file. For `?url`,
				// Vite compiles the CSS separately with a `?transform-only` query.
				let params = new URLSearchParams(query);
				if (params.has("url") || params.has("raw")) {
					return;
				}
				let specifier = path
					.relative(path.dirname(file), mediaFile)
					.split(path.sep)
					.join("/");
				if (!specifier.startsWith(".")) {
					specifier = `./${specifier}`;
				}
				return {
					code: `@import "${specifier}";\n${code}`,
					map: null,
				};
			},
		},
	};
}
