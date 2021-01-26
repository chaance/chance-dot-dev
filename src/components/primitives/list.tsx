import * as React from "react";
import { Box, PolymorphicComponent } from "$components/primitives/box";
import { forwardRef } from "$lib/utils";

const LevelContext = React.createContext(1);

function useListLevelContext() {
	return React.useContext(LevelContext);
}

const List: PolymorphicComponent<
	any,
	{ type: "ordered" | "unordered" }
> = forwardRef(function List(
	{
		type: listType,
		as: asProp = listType === "ordered" ? "ol" : "ul",
		...props
	},
	ref
) {
	const level = useListLevelContext();
	return (
		<LevelContext.Provider
			value={React.useMemo(() => Math.min(level + 1, 5), [level])}
		>
			<Box
				as={asProp as any}
				ref={ref}
				{...props}
				data-level={level}
				data-list-type={listType}
			/>
		</LevelContext.Provider>
	);
});

const ListUnordered = forwardRef<"ul">(function ListUnordered(props, ref) {
	return <List ref={ref} {...props} type="unordered" />;
});

const ListOrdered = forwardRef<"ol">(function ListOrdered(props, ref) {
	return <List ref={ref as any} {...(props as any)} type="ordered" />;
});

const ListItem = forwardRef<"li">(function List({ ...props }, ref) {
	const level = useListLevelContext();
	return <Box as="li" ref={ref} {...props} data-level={level - 1} />;
});

export { List, ListUnordered, ListOrdered, ListItem };
