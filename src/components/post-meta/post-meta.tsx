import React from "react";
import { H4 } from "$components/heading";
import { ListUnordered, ListItem } from "$components/primitives/list";
import { cx, leadingSlashIt } from "$lib/utils";
import { Category } from "$src/categories";
import {
	CategoryList,
	CategoryListItem,
	CategoryLink,
} from "$components/category-list";
const styles = require("./post-meta.module.scss");

const PostMeta = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<"div"> & PostMetaOwnProps
>(function PostMeta(
	{
		author,
		categories = [],
		formattedDate,
		append,
		linkCategories = false,
		...props
	},
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
					linkCategories={linkCategories}
					formattedDate={formattedDate}
					append={append}
					categories={categories}
				/>
			</div>
		</div>
	);
});

type PostMetaOwnProps = {
	author?: Author;
	formattedDate?: string;
	append?: any[];
	categories?: Category[];
	linkCategories?: boolean;
};

type Author = {
	name: string;
	image: string;
};

function Categories({
	categories,
	linkCategories,
}: {
	categories: Category[];
	linkCategories?: boolean;
}) {
	return (
		<div className={styles.categories}>
			<CategoryList className={styles.categoryList}>
				{categories.map((category, i, src) => (
					<CategoryListItem
						key={category.label}
						value={category}
						className={styles.category}
					>
						{linkCategories ? (
							<CategoryLink className={styles.categoryText} />
						) : (
							<span className={styles.categoryText}>{category.label}</span>
						)}
						{i === src.length - 1 ? "" : ", "}
					</CategoryListItem>
				))}
			</CategoryList>
		</div>
	);
}

function PostInfo({
	categories = [],
	formattedDate,
	append,
	linkCategories,
}: Pick<
	PostMetaOwnProps,
	"append" | "categories" | "linkCategories" | "formattedDate"
>) {
	return (
		<div className={styles.postInfo}>
			<ListUnordered className={styles.postInfoList}>
				{formattedDate && (
					<ListItem className={styles.infoItem}>{formattedDate}</ListItem>
				)}
				{append
					? append.filter(Boolean).map((item, index) => (
							<ListItem className={styles.infoItem} key={index}>
								{item}
							</ListItem>
					  ))
					: null}
			</ListUnordered>
			<Categories linkCategories={linkCategories} categories={categories} />
		</div>
	);
}

export { PostMeta };
