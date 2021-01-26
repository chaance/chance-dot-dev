import React from "react";
import { DateTime } from "luxon";
import VH from "@reach/visually-hidden";
import { H4 } from "$components/heading";
import { TwitterIcon } from "$components/icons";
import { Link } from "$components/link";
import { ListUnordered, ListItem } from "$components/primitives/list";
import { cx, leadingSlashIt } from "$lib/utils";
import { config } from "src/site-config";
const styles = require("./post-meta.module.scss");

const PostMeta = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div"> & PostMetaOwnProps
>(function PostMeta(
	{ author, date, append, showTwitterIcon = false, ...props },
	ref
) {
	return (
		<div ref={ref} {...props} className={cx(props.className, styles.wrapper)}>
			{author && author.image && (
				<div className={styles.imageWrapper}>
					<img
						className={styles.image}
						src={leadingSlashIt(author.image)}
						alt={`${author.name} bio`}
					/>
				</div>
			)}
			<div>
				{author && <H4 className={styles.authorName}>{author.name}</H4>}
				<PostInfo
					date={date}
					append={append}
					showTwitterIcon={showTwitterIcon}
				/>
			</div>
		</div>
	);
});

type PostMetaOwnProps = {
	author?: Author;
	date?: string;
	append?: any[];
	showTwitterIcon?: boolean;
};

type Author = {
	name: string;
	image: string;
};

function PostInfo({
	date,
	append,
	showTwitterIcon,
}: Pick<PostMetaOwnProps, "append" | "showTwitterIcon" | "date">) {
	return (
		<ListUnordered className={styles.postInfo}>
			{date && (
				<ListItem className={styles.infoItem}>
					{DateTime.fromISO(date).toFormat("MMMM d, yyyy")}
				</ListItem>
			)}
			{append
				? append.filter(Boolean).map((item, index) => (
						<ListItem className={styles.infoItem} key={index}>
							{item}
						</ListItem>
				  ))
				: null}
			{showTwitterIcon && (
				<ListItem className={styles.infoItem}>
					<Link href={config.twitter}>
						<VH>Twitter</VH>
						<TwitterIcon aria-hidden />
					</Link>
				</ListItem>
			)}
		</ListUnordered>
	);
}

export { PostMeta };
