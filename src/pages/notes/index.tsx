import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Excerpt } from "$components/excerpt";
import { Section, HT } from "$components/heading";
import { getNotes, MDXMatter } from "$lib/get-notes";
import { config } from "$src/site-config";
const styles = require("./notes.module.scss");

function Notes({
	pageTitle = "Notes",
	notes = [],
}: InferGetStaticPropsType<typeof getStaticProps> & {
	pageTitle?: string;
}) {
	//pageTitle =
	return (
		<div className={styles.wrapper}>
			<Head>
				<title>
					{pageTitle === config.siteTitle
						? pageTitle
						: `${pageTitle} | ${config.siteTitle}`}
				</title>
			</Head>
			<main role="main">
				<HT className={styles.title}>Notes</HT>

				<Section>
					{notes.map(({ frontMatter, linkPath }) => {
						return (
							frontMatter.published && (
								<Excerpt
									categories={frontMatter.categories}
									className={styles.post}
									key={linkPath}
									title={frontMatter.title}
									date={frontMatter.date}
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
	);
}

export const getStaticProps: GetStaticProps<{
	notes: MDXMatter[];
}> = async () => {
	const notes = await getNotes();
	return {
		props: {
			notes,
		},
	};
};

export default Notes;
