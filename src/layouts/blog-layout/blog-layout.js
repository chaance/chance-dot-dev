import * as React from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { HT, Section } from "$components/heading";
import { PostMeta } from "$components/post-meta";
import { config } from "$src/site-config";
import { SubscribeForm } from "$components/subscribe-form";
const styles = require("./blog-layout.module.scss");

const MdxSiteLayout = function MdxSiteLayout({
	children: content,
	frontMatter,
}) {
	const { formattedDate, title, description, categories = [] } = frontMatter;
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
							<HT className={styles.title}>{title}</HT>
							<PostMeta
								categories={categories}
								className={styles.postMeta}
								formattedDate={formattedDate}
								linkCategories
							/>
						</header>
						<Section wrap="div" className={styles.content}>
							{content}
						</Section>
					</article>
				</main>
			</div>
			<aside>
				<SubscribeForm className={styles.subscribeForm} />
			</aside>
		</React.Fragment>
	);
};

export default MdxSiteLayout;
