import * as React from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import { VisuallyHidden } from "@reach/visually-hidden";
import { Excerpt } from "$components/excerpt";
import { Section, HT } from "$components/heading";
import { SubscribeForm } from "$components/subscribe-form";
import { categories } from "$src/categories";
import { getNotes, getCategories, MDXMatter } from "$lib/get-notes";
import { config } from "$src/site-config";
import {
	fromArray,
	useIsomorphicLayoutEffect as useLayoutEffect,
} from "$lib/utils";
const styles = require("./[cat-id].module.scss");

function Notes({
	notes,
	categoryLabel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();
	const catId = fromArray(router.query["cat-id"])!;
	const category = categories.has(catId)
		? categories.get(catId)!
		: { slug: catId, label: categoryLabel };

	const pageTitle = `Category: ${category.label} | ${config.siteTitle}`;

	useLayoutEffect(() => {
		if (notes.length < 1) {
			router.push("/");
		}
	}, [notes, router]);

	return (
		<React.Fragment>
			<div className={styles.wrapper}>
				<Head>
					<title>{pageTitle}</title>
				</Head>
				<main role="main">
					<HT className={styles.title}>
						<VisuallyHidden>Category: </VisuallyHidden>
						{category.label}
					</HT>
					<Section>
						{notes.map(({ frontMatter, linkPath }) => {
							return (
								frontMatter.published && (
									<Excerpt
										categories={frontMatter.categories}
										className={styles.post}
										key={linkPath}
										title={frontMatter.title}
										formattedDate={frontMatter.formattedDate}
										slug={linkPath}
										contentType="notes"
										excerpt={frontMatter.description}
									/>
								)
							);
						})}
					</Section>
				</main>
			</div>
			<aside>
				<SubscribeForm className={styles.subscribeForm} />
			</aside>
		</React.Fragment>
	);
}

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const paths = (await getCategories()).map((cat) => ({
		params: {
			"cat-id": cat.slug,
		},
	}));
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<{
	notes: MDXMatter[];
	categoryLabel: string;
}> = async ({ params = {} }) => {
	const catId = fromArray(params["cat-id"])!;
	const categoryLabel = categories.has(catId)
		? categories.get(catId)!.label
		: startCase(catId);
	const notes = await getNotes((post) => {
		return !!(post.frontMatter.categories || []).find(
			(cat) => cat.label === categoryLabel
		);
	});

	return {
		props: {
			notes,
			categoryLabel,
		},
	};
};

export default Notes;
