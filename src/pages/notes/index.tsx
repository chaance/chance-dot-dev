import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Excerpt, ExcerptBox } from "src/components/excerpt";
import { Section, HT } from "src/components/heading";
import { Container } from "src/components/container";
import { SubscribeForm } from "src/components/subscribe-form";
import { getPublishedNotes } from "src/lib/notes-server";
import { Title } from "src/components/title";
import { Spacer } from "src/components/spacer";
import { PublishedNoteMdx } from "src/types";

function Notes({ notes = [] }: InferGetStaticPropsType<typeof getStaticProps>) {
	//pageTitle =
	return (
		<React.Fragment>
			<Container>
				<Title>Notes</Title>
				<Spacer preset="vertical-main" />
				<main>
					<HT>Notes</HT>
					<Section>
						{notes.map(({ frontMatter, linkPath }, i, src) => {
							return (
								<React.Fragment key={linkPath}>
									<ExcerptBox>
										<Excerpt
											categories={frontMatter.categories}
											title={frontMatter.title}
											formattedDate={frontMatter.formattedDate}
											slug={linkPath}
											contentType="notes"
											excerpt={frontMatter.description}
										/>
									</ExcerptBox>
									{i !== src.length - 1 && <Spacer spaces={2} />}
								</React.Fragment>
							);
						})}
					</Section>
					<Spacer preset="vertical-main" />
				</main>
			</Container>
			<aside>
				<Spacer spaces={4} />
				<Container size="wide">
					<SubscribeForm />
				</Container>
			</aside>
		</React.Fragment>
	);
}

export const getStaticProps: GetStaticProps<{
	notes: PublishedNoteMdx[];
}> = async () => {
	const notes = await getPublishedNotes();
	return {
		props: {
			notes,
		},
	};
};

export default Notes;
