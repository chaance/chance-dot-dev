import { resolve, join, basename, dirname, sep as pathSeparator } from "path";
import { readdir, lstat, readFileSync } from "fs-extra";
import matter from "gray-matter";
import uniqBy from "lodash/uniqBy";
import { Category, getCategoryFromLabel } from "$src/categories";
import { getFormattedDate } from "$lib/get-formatted-date";
import { FrontMatter } from "types/mdx";

export const NOTES_PATH = resolve(process.cwd(), "src/notes");

export async function getNoteFilePathFromSlug(slug: string) {
	const fullPath = join(NOTES_PATH, slug);
	if (await isDirectory(fullPath)) {
		return join(fullPath, "index.mdx");
	}
	return fullPath + ".mdx";
}

export async function getNotesFilePaths(): Promise<string[]> {
	let paths: string[] = [];
	for (let filename of await readdir(NOTES_PATH)) {
		let filePath = join(NOTES_PATH, filename);
		if (isMdxFile(filename)) {
			paths.push(filePath);
		} else if ((await isDirectory(filePath)) && (await hasIndexMdx(filePath))) {
			paths.push(join(filePath, "index.mdx"));
		}
	}
	return paths;
}

export async function getNotes(
	filter?: (post: MDXMatter) => boolean
): Promise<MDXMatter[]> {
	let allNotes: MDXMatter[] = [];
	for (let filename of await getNotesFilePaths()) {
		allNotes.push(await getMdx(filename));
	}
	return filter ? allNotes.filter(filter) : allNotes;
}

export async function getCategories(): Promise<Category[]> {
	let allCategories: Category[] = [];
	for (let note of await getNotes()) {
		for (let category of note.frontMatter.categories || []) {
			allCategories.push(category);
		}
	}
	return uniqBy(allCategories, ({ slug }) => slug);
}

async function isDirectory(path: string): Promise<boolean> {
	return (await lstat(path)).isDirectory();
}

function isMdxFile(filename: string): boolean {
	return /\.mdx?$/.test(filename);
}

export function isIndexMdx(path: string): boolean {
	return /^index\.mdx?$/.test(basename(path));
}

async function hasIndexMdx(path: string) {
	try {
		return !!(await readdir(path)).find((resourcePath) =>
			isIndexMdx(resourcePath)
		);
	} catch (err) {
		return false;
	}
}

export function getSlugFromFilePath(path: string): string | null | undefined {
	try {
		return isIndexMdx(path)
			? dirname(path).split(pathSeparator).pop()
			: basename(path).split(".").shift();
	} catch (err) {
		return null;
	}
}

export async function getGrayMatter<
	Opts extends matter.GrayMatterOption<Buffer, Opts>
>(
	filePath: string,
	options?: Opts
): Promise<{
	frontMatter: FrontMatter;
	content: string;
	excerpt?: string | undefined;
	orig: Buffer;
	language: string;
	matter: string;
	stringify(lang: string): string;
}> {
	let { data: frontMatter, ...rest } = matter(readFileSync(filePath), options);
	getCategories();
	let categories: Category[] =
		(frontMatter as any).categories?.map(getCategoryFromLabel) || [];

	return {
		...rest,
		frontMatter: ({
			...frontMatter,
			categories,
			formattedDate: getFormattedDate(frontMatter.date),
		} as unknown) as FrontMatter,
	};
}

async function getMdx(filePath: string): Promise<MDXMatter> {
	let { content, frontMatter } = await getGrayMatter(filePath);
	let linkPath = getSlugFromFilePath(filePath);
	if (!linkPath) {
		throw Error("asdfghjkl");
	}

	return {
		content,
		frontMatter,
		filePath,
		linkPath,
	};
}

export interface MDXMatter {
	content: string;
	frontMatter: FrontMatter;
	filePath: string;
	linkPath: string;
}
