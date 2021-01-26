import { extendComponent } from "$lib/utils";
import {
	List as ListPrimitive,
	ListOrdered as ListOrderedPrimitive,
	ListUnordered as ListUnorderedPrimitive,
	ListItem as ListItemPrimitive,
} from "$components/primitives/list";
const styles = require("./list.module.scss");

const List = extendComponent(ListPrimitive, {
	className: styles.list,
});

const ListOrdered = extendComponent(ListOrderedPrimitive, {
	className: styles.list,
});

const ListUnordered = extendComponent(ListUnorderedPrimitive, {
	className: styles.list,
});

const ListItem = extendComponent(ListItemPrimitive, {
	className: styles.listItem,
});

export { List, ListOrdered, ListUnordered, ListItem };
