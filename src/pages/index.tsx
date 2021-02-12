import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getNotes, MDXMatter } from "$lib/get-notes";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { Excerpt } from "$components/excerpt";
import { Container } from "$components/container";
import { Section, HT, H1 } from "$components/heading";
import { SubscribeForm } from "$components/subscribe-form";
import { config } from "$src/site-config";
import { Hr, P } from "$components/html";
const notesStyles = require("./notes/notes.module.scss");
const styles = require("./index.module.scss");

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
			<Head>
				<title>{config.siteTitle}</title>
			</Head>
			<Container className={notesStyles.wrapper}>
				<main role="main">
					<section className={styles.intro}>
						<HT className={styles.title}>Welcome!</HT>
						<P>Whoa, you came to my website. That's sick, I appreciate it!</P>
						<P>
							My name is Chance. I'm a front-end developer here on the World
							Wide Web. I enjoy teaching, building high-quality user interfaces,
							and far too many non-computer activities to list.
						</P>
						<P>
							Take a look at some of my thoughts or sign up for the occasional
							email below. I'll be adding more to this space soon, so check back
							and see my little corner of the internet grow. 🌱
						</P>
					</section>
					<Hr lineStyle="gradient" lineThickness={2} />
					<H1 className={styles.notesTitle}>Notes</H1>
					<Section>
						{notes.map(({ frontMatter, linkPath }) => {
							return (
								frontMatter.published && (
									<Excerpt
										categories={frontMatter.categories}
										className={notesStyles.post}
										key={linkPath}
										title={frontMatter.title}
										formattedDate={frontMatter.formattedDate}
										slug={linkPath}
										contentType="notes"
										excerpt={frontMatter.description}
										headingStyle={2}
									/>
								)
							);
						})}
					</Section>
				</main>
			</Container>
			<aside>
				<Container size="wide">
					<SubscribeForm className={notesStyles.subscribeForm} />
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

export default Home;
