import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";
import { Box } from "src/components/primitives/box";

const LevelContext = React.createContext(1);

function useListLevelContext() {
	return React.useContext(LevelContext);
}

interface ListOwnProps {
	type: "ordered" | "unordered";
}

const List: PolymorphicForwardRefExoticComponent<
	ListOwnProps,
	"ul"
> = React.forwardRef(function List<T extends React.ElementType = "ul">(
	{ type: listType, as, ...props }: PolymorphicPropsWithoutRef<ListOwnProps, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || "ul";
	const level = useListLevelContext();
	return (
		<LevelContext.Provider
			value={React.useMemo(() => Math.min(level + 1, 5), [level])}
		>
			<Box
				as={comp as any}
				ref={ref}
				{...props}
				data-level={level}
				data-list-type={listType}
			/>
		</LevelContext.Provider>
	);
});

const ListUnordered: PolymorphicForwardRefExoticComponent<
	{},
	"ul"
> = React.forwardRef(function ListUnordered<T extends React.ElementType = "ul">(
	{ as, ...props }: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || "ul";
	return <List ref={ref} as={comp} {...props} type="unordered" />;
});

const ListOrdered: PolymorphicForwardRefExoticComponent<
	{},
	"ol"
> = React.forwardRef(function ListOrdered<T extends React.ElementType = "ol">(
	{ as, ...props }: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || "ol";
	return <List ref={ref} as={comp} {...props} type="ordered" />;
});

const ListItem: PolymorphicForwardRefExoticComponent<
	{},
	"li"
> = React.forwardRef(function ListItem<T extends React.ElementType = "li">(
	{ as, ...props }: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	const comp: React.ElementType = as || "li";
	const level = useListLevelContext();
	return <Box ref={ref} as={comp} {...props} data-level={level - 1} />;
});

export type { ListOwnProps };
export { List, ListUnordered, ListOrdered, ListItem };
