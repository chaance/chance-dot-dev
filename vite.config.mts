/// <reference types="vitest" />
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import dotenv from "dotenv";

const testEnv = dotenv.parse(
	fs.readFileSync(path.resolve(import.meta.dirname, ".env.example")),
);

// We don't need to load `reactRouter` in storybook or tests,
// but we need to load `react`.
const shouldLoadReactRouter = !process.env.VITEST;

export default defineConfig(({ isSsrBuild }) => ({
	build: {
		rollupOptions: isSsrBuild ? { input: "./server/index.ts" } : undefined,
	},
	server: shouldLoadReactRouter
		? // This should fix a bug in React Router that causes the dev server to crash
			// on the first page load after clearing node_modules. Remove this when the
			// issue is fixed.
			// https://github.com/remix-run/react-router/issues/12786#issuecomment-2634033513
			{ warmup: { clientFiles: ["./app/root.tsx"] } }
		: undefined,
	plugins: [
		tsconfigPaths(),
		arraybuffer(),
		shouldLoadReactRouter ? reactRouter() : react(),
	],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./test/setup-test-env.ts"],
		env: testEnv,
	},
}));
