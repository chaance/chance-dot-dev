import * as React from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import { VisuallyHidden } from "@reach/visually-hidden";
import { Container } from "src/components/container";
import { Excerpt, ExcerptBox } from "src/components/excerpt";
import { Section, HT } from "src/components/heading";
import { Title } from "src/components/title";
import { SubscribeForm } from "src/components/subscribe-form";
import { categories } from "src/lib/notes";
import { Spacer } from "src/components/spacer";
import { getPublishedNotes, getCategories } from "src/lib/notes-server";
import {
	fromArray,
	useIsomorphicLayoutEffect as useLayoutEffect,
} from "src/lib/utils";
import { PublishedNoteMdx } from "src/types";

function Notes({
	notes,
	categoryLabel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();
	const catId = fromArray(router.query["cat-id"])!;
	const category = categories.has(catId)
		? categories.get(catId)!
		: { slug: catId, label: categoryLabel };

	useLayoutEffect(() => {
		if (notes.length < 1) {
			router.push("/");
		}
	}, [notes, router]);

	return (
		<React.Fragment>
			<Container>
				<Title>{`Category: ${category.label}`}</Title>
				<Spacer preset="vertical-main" />
				<main>
					<HT>
						<VisuallyHidden>Category: </VisuallyHidden>
						{category.label}
					</HT>
					<Spacer spaces={2} />
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
	notes: PublishedNoteMdx[];
	categoryLabel: string;
}> = async ({ params = {} }) => {
	let catId = fromArray(params["cat-id"])!;
	let categoryLabel = categories.has(catId)
		? categories.get(catId)!.label
		: startCase(catId);
	let allNotes = await getPublishedNotes();
	let notes = allNotes.filter(getCategoryFilter(categoryLabel));

	return {
		props: {
			notes,
			categoryLabel,
		},
	};
};

function getCategoryFilter(categoryLabel: string) {
	return function hasCategory(post: PublishedNoteMdx) {
		let postCategories = post.frontMatter.categories || [];
		return !!postCategories.find((cat) => cat.label === categoryLabel);
	};
}

export default Notes;
