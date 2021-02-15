import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Excerpt } from "src/components/excerpt";
import { Section, HT } from "src/components/heading";
import { Container } from "src/components/container";
import { SubscribeForm } from "src/components/subscribe-form";
import { getNotes, NotesMdx } from "src/lib/notes-server";
import { Title } from "src/components/title";
import { Spacer } from "src/components/spacer";

const styles = require("./notes.module.scss");

function Notes({ notes = [] }: InferGetStaticPropsType<typeof getStaticProps>) {
	//pageTitle =
	return (
		<React.Fragment>
			<Container className={styles.wrapper}>
				<Title>Notes</Title>
				<Spacer preset="vertical-main" />
				<main>
					<HT className={styles.title}>Notes</HT>
					<Section>
						{notes.map(({ frontMatter, linkPath }) => {
							return (
								frontMatter.published &&
								frontMatter.title && (
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
	notes: NotesMdx[];
}> = async () => {
	const notes = await getNotes();
	return {
		props: {
			notes,
		},
	};
};

export default Notes;
