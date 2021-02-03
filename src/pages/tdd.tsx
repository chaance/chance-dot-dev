import * as React from "react";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import { Header } from "$components/header";
import { Footer } from "$components/footer";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { H1 } from "$components/heading";
import { SubscribeForm } from "$components/subscribe-form";
import { P } from "$components/html";
// import { GetStaticProps } from "next";
import { ListOrdered, ListItem } from "$components/list";
const styles = require("./tdd.module.scss");

const RULES = [
	"Write a failing test",
	"Write the simplest code to pass the test",
	"Refactor to remove duplications",
	"Write the assertion first and work backwards",
	"See the test fail",
	"Write meaningful tests",
	"Triangulate",
	"Keep your test and model code separate",
	"Isolate your tests",
	"Organize your tests to reflect model code",
	"Maintain your tests",
	"Each test should test one thing only",
	"Don't refactor with failing tests",
];

const PAGE_TITLE = "The 13 habits for good TDD programming";

function Tdd() {
	return (
		<React.Fragment>
			<NextSeo
				openGraph={{
					title: PAGE_TITLE,
					description: `A process for test-driven development in 13 brief points. Unsure where the credit for this list belongs, but if you stumble into this and know the source, please let me know! This is here as a personal reference, not really an endorsement.`,
					images: [
						{
							url:
								"https://res.cloudinary.com/chancedigital/image/upload/v1612287816/cs.run/og-image.jpg",
							alt: PAGE_TITLE,
							width: 1200,
							height: 630,
						},
					],
				}}
			/>
			<Head>
				<title>{PAGE_TITLE}</title>
			</Head>
			<div className={styles.wrapper}>
				<main role="main">
					<div className={styles.intro}>
						<H1 className={styles.title}>{PAGE_TITLE}</H1>
						<P>
							A process for test-driven development in 13 brief points. Unsure
							where the credit for this list belongs, but if you stumble into
							this and know the source, please let me know! This is here as a
							personal reference, not really an endorsement.
						</P>
					</div>

					<div className={styles.codeSection}>
						<div className={styles.preOuter}>
							<ListOrdered className={styles.pre}>
								{RULES.map((rule) => (
									<ListItem key={rule}>{rule}</ListItem>
								))}
							</ListOrdered>
						</div>
					</div>
				</main>
			</div>
			<aside>
				<SubscribeForm className={styles.subscribeForm} />
			</aside>
		</React.Fragment>
	);
}

Tdd.Layout = ({ children: page }: { children: React.ReactNode }) => {
	return (
		<React.Fragment>
			<SkipNavLink />
			<div className={styles.layoutWrapper}>
				<Header />
				<div className={styles.contentWrapper}>
					<SkipNavContent />
					<div>{page}</div>
				</div>
				<Footer />
			</div>
		</React.Fragment>
	);
};

// export const getStaticProps: GetStaticProps<{
// 	forceTheme: "dark";
// }> = async () => {
// 	return {
// 		props: {
// 			forceTheme: "dark",
// 		},
// 	};
// };

export default Tdd;
