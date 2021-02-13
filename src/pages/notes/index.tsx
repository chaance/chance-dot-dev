import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Excerpt } from "src/components/excerpt";
import { Section, HT } from "src/components/heading";
import { Container } from "src/components/container";
import { SubscribeForm } from "src/components/subscribe-form";
import { getNotes, MDXMatter } from "src/lib/get-notes";
import { config } from "src/site-config";
import { Spacer } from "src/components/spacer";

const styles = require("./notes.module.scss");

function Notes({
	pageTitle = "Notes",
	notes = [],
}: InferGetStaticPropsType<typeof getStaticProps> & {
	pageTitle?: string;
}) {
	//pageTitle =
	return (
		<React.Fragment>
			<Container className={styles.wrapper}>
				<Head>
					<title>
						{pageTitle === config.siteTitle
							? pageTitle
							: `${pageTitle} | ${config.siteTitle}`}
					</title>
				</Head>
				<Spacer preset="vertical-main" />
				<main>
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
			</Container>
			<aside>
				<Container size="wide">
					<SubscribeForm className={styles.subscribeForm} />
				</Container>
			</aside>
		</React.Fragment>
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
