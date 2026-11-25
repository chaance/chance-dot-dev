import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "~/lib/prisma/client/client";

let prisma: PrismaClient;

declare global {
	var __db__: PrismaClient;
}

function createPrismaClient() {
	let url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error("DATABASE_URL is not set");
	}
	return new PrismaClient({
		adapter: new PrismaBetterSqlite3(
			{ url },
			// Prisma 6 stored DateTime columns as integer Unix milliseconds, and the
			// existing production data uses that format. The adapter defaults to
			// ISO-8601 strings, which would mix formats in the same column and
			// break ordering/comparisons (SQLite sorts all integers before text).
			{ timestampFormat: "unixepoch-ms" },
		),
	});
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
	prisma = createPrismaClient();
} else {
	if (!global.__db__) {
		global.__db__ = createPrismaClient();
	}
	prisma = global.__db__;
	prisma.$connect();
}

export { prisma };
