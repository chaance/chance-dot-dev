import * as React from "react";
import { Link } from "$components/link";
import { H1, H2, H3 } from "$components/heading";
import { PostMeta } from "$components/post-meta";
// import { CategoryList } from "$components/category-list";
import { P } from "$components/html";
import { cx, unSlashIt } from "$lib/utils";
import { sprintf } from "$lib/sprintf";
const styles = require("./excerpt.module.scss");

const languageMap: LanguageMap = {
	notes: {
		plural: "notes",
		time: "%s to read",
		linkLabel: 'Read "%s"',
		allLinkLabel: "See all %s",
	},
	talks: {
		plural: "talks",
		time: "%s to watch",
		linkLabel: 'Watch "%s"',
		allLinkLabel: "See all %s",
	},
	workshops: {
		plural: "workshops",
		time: "%s to complete",
		linkLabel: 'Learn more about "%s"',
		allLinkLabel: "See all %s",
	},
};

const Excerpt = React.forwardRef<
	HTMLElement,
	ExcerptOwnProps & React.ComponentPropsWithRef<"article">
>(function Excerpt(
	{
		categories = [],
		contentType = "notes",
		formattedDate,
		excerpt,
		slug,
		timeToRead,
		title,
		headingStyle = 1,
		...props
	},
	ref
) {
	let langMap = languageMap[contentType];
	let time = timeToRead;
	let permalink = `/${contentType}/${unSlashIt(slug)}`;

	let H = headingStyle === 3 ? H3 : headingStyle === 2 ? H2 : H1;

	return (
		<article
			ref={ref}
			{...props}
			className={cx(props.className, styles.article)}
		>
			<div>
				<header className={styles.header}>
					<H className={styles.title}>
						<Link className={styles.titleLink} href={permalink} rel="bookmark">
							{title}
						</Link>
					</H>
					<PostMeta
						className={styles.postMeta}
						formattedDate={formattedDate}
						append={[
							time != null ? sprintf(langMap.time, `${time} minutes`) : false,
						]}
						categories={categories}
					/>
				</header>
				<div>
					{excerpt && (
						<P
							className={styles.content}
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html: excerpt }}
						/>
					)}
				</div>
			</div>
		</article>
	);
});

export { Excerpt };

type LanguageMap = {
	[key in ContentType]: {
		plural: string;
		time: string;
		linkLabel: string;
		allLinkLabel: string;
	};
};
type ContentType = "notes" | "talks" | "workshops";
interface ExcerptOwnProps {
	contentType?: ContentType;
	formattedDate?: string;
	excerpt?: string;
	slug: string;
	timeToRead?: string;
	title: string;
	categories?: string[];
	headingStyle?: 1 | 2 | 3;
}
