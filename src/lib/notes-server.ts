import { resolve, join, basename, dirname, sep as pathSeparator } from "path";
import { readdir, readFile } from "fs-extra";
import kebabCase from "lodash/kebabCase";
import uniqBy from "lodash/uniqBy";
import { getGrayMatter } from "src/lib/mdx-server";
import { isDirectory } from "src/lib/fs";
import { categories, isPublished } from "src/lib/notes";
import { NoteMdx, PublishedNoteMdx, Category } from "src/types";

const NOTES_PATH = resolve(process.cwd(), "src/notes");

async function getNoteFilePathFromSlug(slug: string) {
	const fullPath = join(NOTES_PATH, slug);
	if (await isDirectory(fullPath)) {
		return join(fullPath, "index.mdx");
	}
	return fullPath + ".mdx";
}

async function getNotesFilePaths(): Promise<string[]> {
	let filePaths: string[] = [];
	for (let filename of await readdir(NOTES_PATH)) {
		let filePath = join(NOTES_PATH, filename);
		if (isMdxFile(filename)) {
			filePaths.push(filePath);
		} else if ((await isDirectory(filePath)) && (await hasIndexMdx(filePath))) {
			filePaths.push(join(filePath, "index.mdx"));
		}
	}
	return filePaths;
}

async function getNotes(opts?: GetNotesOptions): Promise<NoteMdx[]> {
	let allNotes: NoteMdx[] = [];
	let { sortBy = "date-latest" } = opts || {};
	for (let filePath of await getNotesFilePaths()) {
		let { content, frontMatter } = await getGrayMatter(
			await readFile(filePath)
		);
		let linkPath = getSlugFromFilePath(filePath);
		if (!linkPath) {
			throw Error("asdfghjkl");
		}
		allNotes.push({
			content,
			frontMatter,
			filePath,
			linkPath,
		});
	}
	return allNotes.sort((noteA, noteB) => {
		switch (sortBy) {
			case "date-earliest":
				return sortByEarliestDate(
					noteA.frontMatter.date!,
					noteB.frontMatter.date!
				);
			case "date-latest":
			default:
				return sortByLatestDate(
					noteA.frontMatter.date!,
					noteB.frontMatter.date!
				);
		}
	});
}

async function getPublishedNotes(
	opts?: GetNotesOptions
): Promise<PublishedNoteMdx[]> {
	return (await getNotes(opts)).filter(isPublished);
}

async function getCategories(): Promise<Category[]> {
	let allCategories: Category[] = [];
	for (let note of await getNotes()) {
		for (let category of note.frontMatter.categories || []) {
			allCategories.push(category);
		}
	}
	return uniqBy(allCategories, ({ slug }) => slug);
}

function isMdxFile(filePath: string): boolean {
	return /\.mdx?$/.test(filePath);
}

function isIndexMdx(filePath: string): boolean {
	return /^index\.mdx?$/.test(basename(filePath));
}

async function hasIndexMdx(filePath: string) {
	try {
		return !!(await readdir(filePath)).find((resourcePath) =>
			isIndexMdx(resourcePath)
		);
	} catch (err) {
		return false;
	}
}

function getSlugFromFilePath(filePath: string): string | null | undefined {
	try {
		return isIndexMdx(filePath)
			? dirname(filePath).split(pathSeparator).pop()
			: basename(filePath).split(".").shift();
	} catch (err) {
		return null;
	}
}

function getCategoryFromLabel(categoryLabel: string) {
	if (categories.has(categoryLabel)) {
		return categories.get(categoryLabel)!;
	}
	return { slug: kebabCase(categoryLabel), label: categoryLabel };
}

function sortByLatestDate(dateA: Date | string, dateB: Date | string): number {
	// @ts-ignore
	return new Date(dateB) - new Date(dateA);
}

function sortByEarliestDate(
	dateA: Date | string,
	dateB: Date | string
): number {
	// @ts-ignore
	return new Date(dateA) - new Date(dateB);
}

interface GetNotesOptions {
	sortBy?: "date-latest" | "date-earliest";
}

export {
	getCategories,
	getCategoryFromLabel,
	getNoteFilePathFromSlug,
	getNotes,
	getPublishedNotes,
	getNotesFilePaths,
	getSlugFromFilePath,
	isIndexMdx,
};
export type { NoteMdx };
