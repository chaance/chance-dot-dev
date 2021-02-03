import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import Layout from "src/layouts/blog-layout";
import { MDXComponents } from "$components/mdx";
import {
	getGrayMatter,
	getNoteFilePathFromSlug,
	getNotesFilePaths,
	getSlugFromFilePath,
} from "$lib/get-notes";
import { MdxRemote } from "next-mdx-remote/types";
import { fromArray } from "$lib/utils";
import { FrontMatter } from "types/mdx";

export default function PostPage({
	source,
	frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const content = hydrate(source, { components: MDXComponents });
	return <Layout frontMatter={frontMatter}>{content}</Layout>;
}

export const getStaticProps: GetStaticProps<{
	source: MdxRemote.Source;
	frontMatter: FrontMatter;
}> = async ({ params = {} }) => {
	let slug = fromArray(params.slug);
	let postFilePath = slug ? await getNoteFilePathFromSlug(slug) : null;
	if (postFilePath == null) {
		throw Error("skfjaksddfgnkdasfkdsfksdf");
	}

	let { content, frontMatter } = await getGrayMatter(postFilePath);

	let mdxSource: MdxRemote.Source = await renderToString(content, {
		components: MDXComponents,
		mdxOptions: {
			remarkPlugins: [
				require("remark-images"),
				require("remark-slug"),
				require("@ngsctt/remark-smartypants"),
			],
			rehypePlugins: [],
		},
		scope: frontMatter as any,
	});

	return {
		props: {
			source: mdxSource,
			frontMatter: frontMatter as any,
		},
	};
};

export const getStaticPaths = async () => {
	const notesFilePaths = await getNotesFilePaths();
	const paths = notesFilePaths
		.map(getSlugFromFilePath)
		.map((slug) => ({ params: { slug } }));
	return {
		paths,
		fallback: false,
	};
};
