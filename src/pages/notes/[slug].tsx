import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { readFile } from "fs-extra";
import hydrate from "next-mdx-remote/hydrate";
import Layout from "src/layouts/blog-layout";
import {
	getNoteFilePathFromSlug,
	getNotesFilePaths,
	getSlugFromFilePath,
} from "src/lib/get-notes";
import { MdxSource, renderToString } from "src/lib/mdx";
import { fromArray } from "src/lib/utils";
import { FrontMatter } from "types/mdx";
import { MDXComponents } from "src/components/mdx";

export default function PostPage({
	source,
	frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const content = hydrate(source as any, { components: MDXComponents });
	return <Layout frontMatter={frontMatter}>{content}</Layout>;
}

export const getStaticProps: GetStaticProps<{
	source: MdxSource;
	frontMatter: FrontMatter;
}> = async ({ params = {} }) => {
	let slug = fromArray(params.slug);
	let postFilePath = slug ? await getNoteFilePathFromSlug(slug) : null;
	if (postFilePath == null) {
		throw Error("skfjaksddfgnkdasfkdsfksdf");
	}

	let mdx = await readFile(postFilePath);
	let source = await renderToString(mdx, { components: MDXComponents });

	return {
		props: {
			source,
			frontMatter: source.scope,
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
