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

function MyApp({ Component, pageProps }: CustomAppProps) {
	// For persistent layouts. Stole this idea from Adam Wathan.
	// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
	const Layout = Component.Layout ? Component.Layout : SiteLayout;

	return (
		<React.Fragment>
			<DefaultSeo {...config.seo} />
			<FontProvider>
				<ThemeProvider forceTheme={pageProps.forceTheme}>
					<MDXProvider components={MDXComponents}>
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</MDXProvider>
				</ThemeProvider>
			</FontProvider>
		</React.Fragment>
	);
}

export default MyApp;

type CustomAppProps = AppProps & {
	Component: AppProps["Component"] & { Layout?: React.ComponentType<any> };
};
