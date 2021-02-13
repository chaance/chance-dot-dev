import * as React from "react";
import Head from "next/head";
import { config } from "src/site-config";

const SEPARATOR = "|";

function Title({ suffix, children, omitMeta }: TitleProps) {
	let title = getPageTitle({ suffix, pageName: children! });
	return title ? (
		<Head>
			<title>{title}</title>
			{/*
			Next uses the key to avoid duplicating tags.
			Key is "og:title" because that's what NextSeo uses internally.
			*/}
			{!omitMeta ? (
				<meta key="og:title" property="og:title" content={title} />
			) : null}
		</Head>
	) : null;
}

interface TitleProps {
	suffix?: string | undefined | null;
	children?: string;
	omitMeta?: boolean;
}

export { getPageTitle, Title };

function getPageTitle({
	pageName,
	suffix: suffixProp,
}: {
	pageName: string;
	suffix?: string | undefined | null;
}) {
	if (!pageName) {
		return "";
	}

	// If suffix is explicitly set to null, omit it
	let suffix = suffixProp !== null ? suffixProp || config.siteTitle : null;
	return [pageName, suffix].filter(Boolean).join(" " + SEPARATOR + " ");
}
