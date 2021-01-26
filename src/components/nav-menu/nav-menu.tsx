import * as React from "react";
import { Link, LinkProps } from "$components/link";
import { ListUnordered, ListItem } from "$components/primitives/list";
import { cx } from "$lib/utils";
const styles = require("./nav-menu.module.scss");

const NavMenu = React.forwardRef<
	HTMLUListElement,
	React.ComponentProps<typeof ListUnordered>
>(function NavMenu(props, ref) {
	return (
		<ListUnordered
			ref={ref}
			{...props}
			className={cx(props.className, styles.menu)}
		/>
	);
});
NavMenu.displayName = "NavMenu";

const NavMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<typeof ListItem>
>(function NavMenuItem(props, ref) {
	return (
		<ListItem
			ref={ref}
			{...props}
			className={cx(props.className, styles.menuItem)}
		/>
	);
});
NavMenuItem.displayName = "NavMenuItem";

const NavMenuLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
	function NavMenuLink(props, ref) {
		return <Link {...props} ref={ref} />;
	}
);
NavMenuLink.displayName = "NavMenuLink";

export { NavMenu, NavMenuItem, NavMenuLink };
