import { Category } from "src/categories";
// https://github.com/jescalan/babel-plugin-import-glob-array/issues/7#issuecomment-626936433
interface FrontMatter {
	slug?: string;
	subtitle?: string;
	date?: string;
	formattedDate?: string;
	title?: string;
	description?: string;
	langs?: string[];
	categories?: Category[];
	keywords?: string[];
	banner?: string;
	bannerAlt?: string;
	published?: boolean;
	author?: string;
}
