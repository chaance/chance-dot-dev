import * as React from "react";
import { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { DefaultSeo } from "next-seo";
import { FontProvider } from "$lib/fonts";
import { ThemeProvider } from "$lib/theme";
import { MDXComponents } from "$components/mdx";
import SiteLayout from "src/layouts/site-layout";
import { config } from "$src/site-config";
import "src/styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
	// For persistent layouts. Stole this idea from Adam Wathan.
	// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
	const getLayout: (page: React.ReactElement) => React.ReactElement =
		(Component as any).getLayout || ((page) => <SiteLayout>{page}</SiteLayout>);

	return (
		<React.Fragment>
			<DefaultSeo {...config.seo} />
			<FontProvider>
				<ThemeProvider>
					<MDXProvider components={MDXComponents}>
						{getLayout(<Component {...pageProps} />)}
					</MDXProvider>
				</ThemeProvider>
			</FontProvider>
		</React.Fragment>
	);
}

export default MyApp;
