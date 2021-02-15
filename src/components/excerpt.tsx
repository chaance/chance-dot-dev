import * as React from "react";
import { Link } from "src/components/link";
import { H1, H2, H3 } from "src/components/heading";
import { PostMeta } from "src/components/post-meta";
// import { CategoryList } from "src/components/category-list";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/html";
import { cx, unSlashIt } from "src/lib/utils";
import { sprintf } from "src/lib/sprintf";
import { Category } from "src/types";
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
				<header>
					<H>
						<Link className={styles.titleLink} href={permalink} rel="bookmark">
							{title}
						</Link>
					</H>
					<Spacer spaces={1 / 3} />
					<PostMeta
						className={styles.postMeta}
						formattedDate={formattedDate}
						append={[
							time != null ? sprintf(langMap.time, `${time} minutes`) : false,
						]}
						categories={categories}
					/>
				</header>
				<Spacer />
				<div className="prose">
					{excerpt && (
						<P
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
	categories?: Category[];
	headingStyle?: 1 | 2 | 3;
}
