import * as React from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import startCase from "lodash/startCase";
import { useRouter } from "next/router";
import { VisuallyHidden } from "@reach/visually-hidden";
import { Excerpt } from "src/components/excerpt";
import { Section, HT } from "src/components/heading";
import { Title } from "src/components/title";
import { SubscribeForm } from "src/components/subscribe-form";
import { categories } from "src/categories";
import { getNotes, getCategories, MDXMatter } from "src/lib/get-notes";
import {
	fromArray,
	useIsomorphicLayoutEffect as useLayoutEffect,
} from "src/lib/utils";
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

	useLayoutEffect(() => {
		if (notes.length < 1) {
			router.push("/");
		}
	}, [notes, router]);

	return (
		<React.Fragment>
			<div className={styles.wrapper}>
				<Title>{`Category: ${category.label}`}</Title>
				<main>
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
