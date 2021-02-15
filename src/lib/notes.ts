import { NotesMdx, Category } from "src/types";

function isPublished(note: NotesMdx) {
	return !!(note.frontMatter.title && note.frontMatter.published);
}

const categories = new Map<string, Category>([
	//
]);

export { categories, isPublished };
