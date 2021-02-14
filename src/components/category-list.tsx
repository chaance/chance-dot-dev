import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";
import { VisuallyHidden } from "@reach/visually-hidden";
import { Link } from "src/components/link";
import { Box, BoxOwnProps } from "src/components/primitives/box";
import { Category } from "src/types";

const CategoryList: PolymorphicForwardRefExoticComponent<
	BoxOwnProps,
	"div"
> = React.forwardRef(
	<T extends React.ElementType = "div">(
		{ as, ...props }: PolymorphicPropsWithoutRef<BoxOwnProps, T>,
		ref: React.ForwardedRef<React.ElementRef<T>>
	) => {
		const comp: React.ElementType = as || "div";
		return <Box ref={ref} as={comp} {...props} />;
	}
);

const CategoryItemContext = React.createContext<CategoryItemContextValue>(
	null!
);

const CategoryListItem: PolymorphicForwardRefExoticComponent<
	CategoryItemOwnProps,
	"span"
> = React.forwardRef(
	<T extends React.ElementType = "span">(
		{
			as,
			value,
			children,
			...props
		}: PolymorphicPropsWithoutRef<CategoryItemOwnProps, T>,
		ref: React.ForwardedRef<React.ElementRef<T>>
	) => {
		const comp: React.ElementType = as || "span";
		return (
			<CategoryItemContext.Provider value={{ category: value }}>
				<VisuallyHidden>Categories: </VisuallyHidden>
				<Box ref={ref} as={comp} {...props}>
					{children || value.label}
				</Box>
			</CategoryItemContext.Provider>
		);
	}
);

const CategoryLink: React.FC<
	Omit<React.ComponentProps<typeof Link>, "href">
> = ({ children, ...props }) => {
	const { category } = React.useContext(CategoryItemContext);
	return (
		<Link {...props} rel="category" href={`/category/${category.slug}`}>
			{children || category.label}
		</Link>
	);
};

interface CategoryItemOwnProps extends BoxOwnProps {
	value: Category;
}

interface CategoryItemContextValue {
	category: Category;
}

export { CategoryList, CategoryListItem, CategoryLink };
export default CategoryList;
