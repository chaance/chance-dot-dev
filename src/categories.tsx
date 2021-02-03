import kebabCase from "lodash/kebabCase";

export type Category = {
	slug: string;
	label: string;
};

export const categories = new Map<string, Category>([
	//
]);

export function getCategoryFromLabel(categoryLabel: string) {
	if (categories.has(categoryLabel)) {
		return categories.get(categoryLabel)!;
	}
	return { slug: kebabCase(categoryLabel), label: categoryLabel };
}
