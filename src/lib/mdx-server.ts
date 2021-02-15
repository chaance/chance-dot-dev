import { DateTime } from "luxon";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";
import { getCategoryFromLabel } from "src/lib/notes-server";
import { FrontMatter, Category } from "src/types";

async function getGrayMatter<
	Input extends matter.Input,
	Opts extends matter.GrayMatterOption<Input, Opts>
>(
	content: Input | { content: Input },
	options?: Opts
): Promise<{
	frontMatter: FrontMatter;
	content: string;
	excerpt?: string | undefined;
	orig: Buffer | Input;
	language: string;
	matter: string;
	stringify(lang: string): string;
}> {
	let { data: frontMatter, ...rest } = matter(content, options);
	let categories: Category[] | undefined = (frontMatter as any).categories?.map(
		getCategoryFromLabel
	);

	return {
		...rest,
		frontMatter: ({
			...frontMatter,
			categories,
			formattedDate: frontMatter.date
				? getFormattedDate(frontMatter.date)
				: undefined,
		} as unknown) as FrontMatter,
	};
}

async function mdxRenderToString<Input extends matter.Input>(
	source: Input | { content: Input },
	{ components }: { components?: MdxRemote.Components } = {}
): Promise<MdxSource> {
	let { content, frontMatter } = await getGrayMatter(source);
	return (await renderToString(content, {
		components,
		mdxOptions: {
			remarkPlugins: [
				require("remark-images"),
				require("remark-slug"),
				require("@ngsctt/remark-smartypants"),
			],
			rehypePlugins: [],
		},
		scope: frontMatter as any,
	})) as any;
}

function getFormattedDate(date: string, options?: { format?: string }) {
	const { format = "MMMM d, yyyy" } = options || {};
	return DateTime.fromISO(date).toFormat(format);
}

export { getGrayMatter, mdxRenderToString as renderToString };
export type { MdxSource };

interface MdxSource {
	compiledSource: string;
	renderedOutput: string;
	scope: FrontMatter;
}
