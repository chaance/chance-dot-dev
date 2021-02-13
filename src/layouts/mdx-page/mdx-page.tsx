import * as React from "react";
import { NextSeo, NextSeoProps } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { HT, Section } from "src/components/heading";
import { config } from "src/site-config";
import { Container } from "src/components/container";
import { SubscribeForm } from "src/components/subscribe-form";
import { Spacer } from "src/components/spacer";
const styles = require("./mdx-page.module.scss");

const MdxPage = function MdxPage({
	title,
	children: content,
	meta,
}: MdxPageProps) {
	// const { formattedDate, title, description, categories = [] } = frontMatter;
	const router = useRouter();
	const url = config.siteUrl + router.pathname;
	return (
		<React.Fragment>
			<NextSeo
				openGraph={{
					url,
					...meta,
					title: meta?.title || `${title} | ${config.siteTitle}`,
				}}
			/>
			<Head>
				<title>{`${title} | ${config.siteTitle}`}</title>
			</Head>
			<Container>
				<Spacer preset="vertical-main" />
				<main>
					<article>
						<header>
							<HT>{title}</HT>
							<Spacer spaces={2} />
						</header>
						<Spacer spaces={1} />
						<Section wrap className={styles.content}>
							{content}
						</Section>
					</article>
				</main>
				<Spacer preset="vertical-main" />
			</Container>
			<aside>
				<Spacer spaces={4} />
				<Container size="wide">
					<SubscribeForm className={styles.subscribeForm} />
				</Container>
			</aside>
		</React.Fragment>
	);
};

export { MdxPage };
export default MdxPage;

interface MdxPageProps {
	title: string;
	children: React.ReactNode;
	meta?: NextSeoProps["openGraph"];
}
