// import * as React from "react";
import { Section, H1, H2, H3, H4, H5, H6 } from "src/components/heading";
import { Link } from "src/components/link";
import { ListOrdered, ListUnordered, ListItem } from "src/components/list";
import { Abbr, Blockquote, Cite, Hr, Legend,
	P } from "src/components/html";
import { Box } from "src/components/primitives/box";
import { Image } from "src/components/image";
const styles = require("./mdx.module.scss");

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
	img: (props: any) => (
		<Box className={styles.imgWrapper}>
			<Image {...props} />
		</Box>
	),
	legend: Legend,
	li: ListItem,
	ol: ListOrdered,
	p: P,
	section: Section,
	ul: ListUnordered,
};

export default MDXComponents;
