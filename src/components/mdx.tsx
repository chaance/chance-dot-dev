// import * as React from "react";
import { Section, H1, H2, H3, H4, H5, H6 } from "$components/heading";
import { Link } from "$components/link";
import { ListOrdered, ListUnordered, ListItem } from "$components/list";
import { Abbr, Blockquote, Cite, Hr, Legend, P } from "$components/html";

export const MDXComponents = {
	a: Link,
	abbr: Abbr,
	blockquote: Blockquote,
	cite: Cite,
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	hr: Hr,
	legend: Legend,
	li: ListItem,
	ol: ListOrdered,
	p: P,
	section: Section,
	ul: ListUnordered,
};

export default MDXComponents;
