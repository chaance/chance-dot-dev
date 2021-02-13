import * as React from "react";
import type {
	PolymorphicForwardRefExoticComponent,
	PolymorphicPropsWithoutRef,
} from "react-polymorphic-types";
import {
	ListOrdered as ListOrderedPrimitive,
	ListUnordered as ListUnorderedPrimitive,
	ListItem as ListItemPrimitive,
} from "src/components/primitives/list";
const styles = require("./list.module.scss");

const ListOrdered: PolymorphicForwardRefExoticComponent<
	{},
	"ol"
> = React.forwardRef(function ListOrdered<T extends React.ElementType = "ol">(
	props: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	return (
		<ListOrderedPrimitive
			ref={ref}
			{...props}
			className={[styles.list, props.className]}
		/>
	);
});

const ListUnordered: PolymorphicForwardRefExoticComponent<
	{},
	"ul"
> = React.forwardRef(function ListUnordered<T extends React.ElementType = "ul">(
	props: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	return (
		<ListUnorderedPrimitive
			ref={ref}
			{...props}
			className={[styles.list, props.className]}
		/>
	);
});

const ListItem: PolymorphicForwardRefExoticComponent<
	{},
	"li"
> = React.forwardRef(function ListItem<T extends React.ElementType = "li">(
	props: PolymorphicPropsWithoutRef<{}, T>,
	ref: React.ForwardedRef<React.ElementRef<T>>
) {
	return (
		<ListItemPrimitive
			ref={ref}
			{...props}
			className={[styles.listItem, props.className]}
		/>
	);
});

export { ListOrdered, ListUnordered, ListItem };
