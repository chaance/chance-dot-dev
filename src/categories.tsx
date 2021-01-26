export type Category = {
	slug: string;
	label: string;
};

export const categories = new Map<string, Category>([
	// Politics
	["politics", { slug: "politics", label: "Politics" }],
]);
