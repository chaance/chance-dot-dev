import { resolve, join, basename, dirname, sep as pathSeparator } from "path";
import { readdir, readFile } from "fs-extra";
import uniqBy from "lodash/uniqBy";
import { sortByLatestDate } from "src/lib/sort-by-date";
import { getGrayMatter } from "src/lib/mdx";
import { isDirectory } from "src/lib/fs";
import { FrontMatter, Category } from "src/types";

// NOTE: These utils should generally be used for server-side work.

export const NOTES_PATH = resolve(process.cwd(), "src/notes");

export async function getNoteFilePathFromSlug(slug: string) {
	const fullPath = join(NOTES_PATH, slug);
	if (await isDirectory(fullPath)) {
		return join(fullPath, "index.mdx");
	}
	return fullPath + ".mdx";
}

export async function getNotesFilePaths(): Promise<string[]> {
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

export async function getNotes(
	filter?: (post: NotesMdx) => boolean
): Promise<NotesMdx[]> {
	let allNotes: NotesMdx[] = [];
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
	return (filter ? allNotes.filter(filter) : allNotes).sort((noteA, noteB) =>
		sortByLatestDate(noteA.frontMatter.date!, noteB.frontMatter.date!)
	);
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

function isMdxFile(filename: string): boolean {
	return /\.mdx?$/.test(filename);
}

export function isIndexMdx(filePath: string): boolean {
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

export function getSlugFromFilePath(
	filePath: string
): string | null | undefined {
	try {
		return isIndexMdx(filePath)
			? dirname(filePath).split(pathSeparator).pop()
			: basename(filePath).split(".").shift();
	} catch (err) {
		return null;
	}
}

export interface NotesMdx {
	content: string;
	frontMatter: FrontMatter;
	filePath: string;
	linkPath: string;
}
