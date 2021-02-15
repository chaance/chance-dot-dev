import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { getPublishedNotes } from "src/lib/notes-server";
import { Title } from "src/components/title";
import { Excerpt } from "src/components/excerpt";
import { Container } from "src/components/container";
import { Section, HT, H1 } from "src/components/heading";
import { SubscribeForm } from "src/components/subscribe-form";
import { Spacer } from "src/components/spacer";
import { config } from "src/site-config";
import { Hr, P } from "src/components/html";
import { PublishedNoteMdx } from "src/types";
const notesStyles = require("./notes/notes.module.scss");

function Home({ notes }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<React.Fragment>
			<NextSeo
				openGraph={{
					title: config.siteTitle,
					images: [
						{
							url:
								"https://res.cloudinary.com/chancedigital/image/upload/v1612287816/cs.run/og-image.jpg",
							alt: "Welcome to chance.dev!",
							width: 1200,
							height: 630,
						},
					],
				}}
			/>
			<Title suffix={null}>{config.siteTitle}</Title>
			<Container>
				<Spacer preset="vertical-main" />
				<main>
					<section>
						<HT>Welcome!</HT>
						<Spacer spaces={1 / 2} />
						<div className="prose">
							<P>Whoa, you came to my website. That's sick, I appreciate it!</P>
							<P>
								My name is Chance. I'm a front-end developer here on the World
								Wide Web. I enjoy teaching, building high-quality user
								interfaces, and far too many non-computer activities to list.
							</P>
							<P>
								Take a look at some of my thoughts or sign up for the occasional
								email below. I'll be adding more to this space soon, so check
								back and see my little corner of the internet grow. 🌱
							</P>
						</div>
					</section>
					<Spacer />
					<Hr lineStyle="gradient" lineThickness={2} />
					<H1>Notes</H1>
					<Spacer />
					<Section>
						{notes.map(({ frontMatter, linkPath }, i, src) => {
							return (
								<React.Fragment key={linkPath}>
									<Excerpt
										categories={frontMatter.categories}
										className={notesStyles.post}
										title={frontMatter.title}
										formattedDate={frontMatter.formattedDate}
										slug={linkPath}
										contentType="notes"
										excerpt={frontMatter.description}
										headingStyle={2}
									/>
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

export default Home;
