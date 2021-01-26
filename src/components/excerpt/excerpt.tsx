import * as React from "react";
import { Link } from "$components/link";
import VH from "@reach/visually-hidden";
import { H1 } from "$components/heading";
import { PostMeta } from "$components/post-meta";
import { CategoryList } from "$components/category-list";
import { P } from "$components/html";
import { forwardRef, cx, unSlashIt } from "$lib/utils";
import { sprintf } from "sprintf-js";
const styles = require("./excerpt.module.scss");

const languageMap: LanguageMap = {
	notes: {
		plural: "notes",
		time: "%s to read",
		linkLabel: 'Read "%s"',
		allLinkLabel: "See All %s",
	},
};

const defaultMore = (title: string) => (
	<React.Fragment>
		Read More<VH> from {`"${title}"`}</VH>
	</React.Fragment>
);

const Excerpt = forwardRef<"article", ExcerptProps>(function Excerpt(
	{
		categories = [],
		contentType = "notes",
		date,
		excerpt,
		includeAllLink,
		renderReadMore = defaultMore,
		slug,
		timeToRead,
		title,
		...props
	},
	ref
) {
	let langMap = languageMap[contentType] || languageMap.notes;
	let time = timeToRead;
	let permalink = `/${contentType}/${unSlashIt(slug)}`;

	return (
		<article
			ref={ref}
			{...props}
			className={cx(props.className, styles.article)}
		>
			<div>
				<header className={styles.header}>
					<H1 className={styles.title}>
						<Link className={styles.titleLink} href={permalink}>
							{title}
						</Link>
					</H1>
					{categories.length > 0 ? (
						<Categories categories={categories} />
					) : null}
					<PostMeta
						className={styles.postMeta}
						date={date}
						append={[
							time != null ? sprintf(langMap.time, `${time} minutes`) : false,
						]}
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

					<span className={styles.moreWrapper}>
						<Link className={styles.moreLink} href={permalink} rel="bookmark">
							{renderReadMore(title)}
						</Link>

						{includeAllLink && (
							<Link className={styles.moreLink} href={`/${contentType}`}>
								{sprintf(langMap.allLinkLabel, langMap.plural)}
							</Link>
						)}
					</span>
				</div>
			</div>
		</article>
	);
});

function Categories({ categories }: { categories: string[] }) {
	return (
		<div className={styles.categories}>
			<VH>Categories</VH>
			<CategoryList
				linkCategories={false}
				categories={categories}
				className={styles.categoryList}
			/>
		</div>
	);
}

export { Excerpt };

type LanguageMap = {
	[key in ContentType]?: {
		plural: string;
		time: string;
		linkLabel: string;
		allLinkLabel: string;
	};
};
type ContentType = "notes" | "talks" | "workshops";
type ExcerptProps = {
	contentType?: ContentType;
	date: string;
	excerpt?: string;
	includeAllLink?: boolean;
	slug: string;
	timeToRead?: string;
	title: string;
	categories?: string[];
	renderReadMore?(title: string): React.ReactNode;
};
