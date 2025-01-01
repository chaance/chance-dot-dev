/// <reference types="vitest" />
import fs from "node:fs";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import dotenv from "dotenv";

const testEnv = dotenv.parse(
	fs.readFileSync(path.resolve(import.meta.dirname, ".env.example")),
);

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		splitVendorChunkPlugin(),
		arraybuffer(),
		reactRouter(),
	],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./test/setup-test-env.ts"],
		env: testEnv,
	},
});
