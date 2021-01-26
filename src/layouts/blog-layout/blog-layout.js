import * as React from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import VH from "@reach/visually-hidden";
import { useRouter } from "next/router";
import { HT, Section } from "$components/heading";
import { PostMeta } from "$components/post-meta";
import { CategoryList } from "$components/category-list";
import { config } from "$src/site-config";
const styles = require("./blog-layout.module.scss");

// Currently `getLayout` doesn't work as expected for MDX layouts using our mdx
// plugin. Haven't dug deep into it yet but I suspect the actual component
// resolved by our app is a wrapper without the static property. Probably not a
// problem but leaving this here in case I ever need to create an MDX page with
// an alterate server-rendered layout.
// https://github.com/hashicorp/next-mdx-enhanced

const MdxSiteLayout = function MdxSiteLayout({
	children: content,
	frontMatter,
}) {
	const { date, title, description, categories = [] } = frontMatter;
	const router = useRouter();
	const url = config.siteUrl + router.pathname;
	const images = frontMatter.card
		? [{ url: frontMatter.card, alt: frontMatter.cardAlt }]
		: undefined;
	return (
		<React.Fragment>
			<NextSeo
				openGraph={{
					url,
					title,
					description,
					images,
				}}
			/>
			<Head>
				<title>{`${title} | ${config.siteTitle}`}</title>
			</Head>
			<div className={styles.wrapper}>
				<main role="main">
					<article className={styles.article}>
						<header>
							{categories.length > 0 ? (
								<Categories categories={categories} />
							) : null}
							<HT className={styles.title}>{title}</HT>
							<PostMeta className={styles.postMeta} date={date} />
						</header>
						<Section wrap="div" className={styles.content}>
							{content}
						</Section>
					</article>
				</main>
			</div>
		</React.Fragment>
	);
};

function Categories({ categories }) {
	return (
		<div className={styles.categories}>
			<VH>Categories</VH>
			<CategoryList categories={categories} />
		</div>
	);
}

export default MdxSiteLayout;
