import * as React from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { HT, Section } from "src/components/heading";
import { PostMeta } from "src/components/post-meta";
import { config } from "src/site-config";
import { SubscribeForm } from "src/components/subscribe-form";
import { Title } from "src/components/title";
const styles = require("./blog-layout.module.scss");

const BlogLayout = function BlogLayout({ children: content, frontMatter }) {
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
					description,
					images,
				}}
			/>
			<Title>{title}</Title>
			<div className={styles.wrapper}>
				<main>
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
						<Section wrap="div" className={[styles.content, "prose"]}>
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

export { BlogLayout };
export default BlogLayout;
