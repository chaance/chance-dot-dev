import * as React from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import VH from "@reach/visually-hidden";
import { Excerpt } from "$components/excerpt";
import { Section, HT } from "$components/heading";
import { categories } from "$src/categories";
import { getNotes, getCategories } from "$lib/get-notes";
import { config } from "$src/site-config";
import { useIsomorphicLayoutEffect as useLayoutEffect } from "$lib/utils";
const styles = require("./[cat-id].module.scss");

function Notes({ notes }: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();
	const catId: string = Array.isArray(router.query["cat-id"])
		? router.query["cat-id"][0]
		: router.query["cat-id"];
	const category = categories.has(catId)
		? categories.get(catId)
		: { slug: catId, label: startCase(catId) };

	const pageTitle = `Category: ${category.label} | ${config.siteTitle}`;

	useLayoutEffect(() => {
		if (notes.length < 1) {
			router.push("/");
		}
	}, [notes, router]);

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<main role="main">
				<HT className={styles.title}>
					<VH>Category: </VH>
					{category.label}
				</HT>
				<Section>
					{notes.map((post) => {
						return (
							post.published && (
								<Excerpt
									categories={post.categories}
									className={styles.post}
									key={post.slug}
									title={post.title}
									date={post.date}
									slug={post.slug}
									contentType="notes"
									excerpt={post.description}
								/>
							)
						);
					})}
				</Section>
			</main>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
	const paths = getCategories().map((cat) => ({
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
	notes: FrontMatter[];
}> = async ({ params }) => {
	const notes = getNotes((post) => {
		const catId = Array.isArray(params["cat-id"])
			? params["cat-id"][0]
			: params["cat-id"];
		const catLabel = categories.has(catId)
			? categories.get(catId).label
			: startCase(catId);
		return (post.categories || []).includes(catLabel);
	});
	return {
		props: {
			notes,
		},
	};
};

export default Notes;
