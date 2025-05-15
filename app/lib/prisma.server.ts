// https://github.com/prisma/prisma/issues/15614#issuecomment-1491269798
import type {
	PrismaClient as ImportedPrismaClient,
	Prisma,
	BlogPost,
	CodeRecipe,
	CodeRecipeBlock,
	EmailList,
	EmailSubscriber,
	Password,
	Profile,
	User,
} from "./prisma/client";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient: RequiredPrismaClient } = require("./prisma/client");
const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;

export class PrismaClient extends _PrismaClient {}

export type {
	Prisma,
	BlogPost,
	CodeRecipe,
	CodeRecipeBlock,
	EmailList,
	EmailSubscriber,
	Password,
	Profile,
	User,
};
