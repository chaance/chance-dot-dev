import { Category } from "src/categories";
// https://github.com/jescalan/babel-plugin-import-glob-array/issues/7#issuecomment-626936433
interface FrontMatter {
	__resourcePath: string;
	slug?: string;
	subtitle?: string;
	date: string;
	formattedDate: string;
	title: string;
	description?: string;
	langs?: string[];
	categories?: Category[];
	keywords?: string[];
	banner?: string;
	bannerAlt?: string;
	published?: boolean;
	author?: string;
	// author?: redirects[];
}

declare module "*.mdx" {
	let MDXComponent: (props: any) => JSX.Element;
	export type { FrontMatter };
	export default MDXComponent;
	export const frontMatter: FrontMatter[];
}
