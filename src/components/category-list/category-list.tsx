import * as React from "react";
import { Link } from "$components/link";
import kebabCase from "lodash/kebabCase";
import { cx } from "$lib/utils";
const styles = require("./category-list.module.scss");

const CategoryList: React.FC<{
	categories: string[];
	className?: import("clsx").ClassValue;
	linkCategories?: boolean;
}> = function CategoryList({ categories, className, linkCategories = true }) {
	const CatWrapper = ({ category, ...props }: any) =>
		linkCategories ? (
			<Link
				{...props}
				rel="category"
				href={`/category/${kebabCase(category)}`}
				className={styles.categoryLink}
			/>
		) : (
			<span {...props} className={styles.categoryText} />
		);

	return (
		<div className={cx(styles.categoryList, className)}>
			{categories.map((category, i, src) => (
				<span key={category} className={styles.category}>
					<CatWrapper category={category}>{category}</CatWrapper>
					{i === src.length - 1 ? "" : " "}
				</span>
			))}
		</div>
	);
};

export { CategoryList };
export default CategoryList;
