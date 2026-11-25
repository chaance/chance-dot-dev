import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		// Read directly from `process.env` instead of Prisma's `env()` helper,
		// which throws when the variable is missing. `prisma generate` doesn't
		// need a database, and CI runs it without one.
		url: process.env.DATABASE_URL,
	},
});
