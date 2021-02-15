import { NoteMdx, PublishedNoteMdx, Category } from "src/types";

function isPublished(note: NoteMdx): note is PublishedNoteMdx {
	return !!(note.frontMatter.title && note.frontMatter.published);
}

const categories = new Map<string, Category>([
	//
]);

export { categories, isPublished };
