import * as path from "path";
import uniqBy from "lodash/uniqBy";
import kebabCase from "lodash/kebabCase";
import { frontMatter } from "../pages/notes/**/*.mdx";
import { Category, categories } from "$src/categories";

export function getNotes(
	filter: (post: FrontMatter) => boolean = () => true
): FrontMatter[] {
	if (!frontMatter) return [];
	const notes: FrontMatter[] = [];
	for (const post of frontMatter) {
		if (post.published && filter(post)) {
			notes.push({
				...post,
				slug: path.basename(post.__resourcePath).startsWith("index")
					? path.dirname(post.__resourcePath).split(path.sep).pop()
					: path.basename(post.__resourcePath).split(".").shift(),
			});
		}
	}
	return notes;
}

export function getCategories(): Category[] {
	return getNotes().reduce<Category[]>((allCats, fm) => {
		const cat = fm.categories.map((c) => {
			if (categories.has(c)) {
				return categories.get(c);
			}
			return { slug: kebabCase(c), label: c };
		});
		return uniqBy([...allCats, ...cat], ({ slug }) => slug);
	}, []);
}
