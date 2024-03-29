/// <reference types="vitest" />
/// <reference types="vite/client" />

import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

const env = dotenv.parse(
	fs.readFileSync(path.resolve(process.cwd(), ".env.example"))
);

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./test/setup-test-env.ts"],
		env,
	},
});
