import * as React from "react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { HT, Section } from "$components/heading";
import { config } from "$src/site-config";
import { SubscribeForm } from "$components/subscribe-form";
const styles = require("./mdx-page.module.scss");

const MdxPage = function MdxPage({ title, children: content, meta }) {
	// const { formattedDate, title, description, categories = [] } = frontMatter;
	const router = useRouter();
	const url = config.siteUrl + router.pathname;
	return (
		<React.Fragment>
			<NextSeo
				openGraph={{
					url,
					...meta,
					title: meta.title || `${title} | ${config.siteTitle}`,
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

export { MdxPage };
export default MdxPage;
