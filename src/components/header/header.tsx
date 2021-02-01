import * as React from "react";
import { Link } from "$components/link";
// import { NavMenu, NavMenuItem, NavMenuLink } from "$components/nav-menu";
import { DarkModeSwitch } from "$components/dark-mode-switch";
import { ClientOnly } from "$components/primitives/client-only";
import { cx } from "$lib/utils";
import { useRouter } from "next/router";
import { Heading } from "$components/heading";
import { LogoLarge, LogoSmall } from "$components/logo";
import { VisuallyHidden } from "@reach/visually-hidden";
const styles = require("./header.module.scss");

// const StyledMenuItem = forwardRef((props, ref) => (
// 	<NavMenuItem {...props} ref={ref} className={styles.menuItem} />
// ));
// const StyledMenuLink = forwardRef((props, ref) => (
// 	<NavMenuLink {...props} ref={ref} className={styles.menuLink} />
// ));

const Header = React.forwardRef<HTMLElement, React.ComponentProps<"header">>(
	function Header({ ...props }, forwardedRef) {
		const { pathname } = useRouter();
		const LinkWrapper = pathname === "/" ? Heading : "span";
		return (
			<header
				ref={forwardedRef}
				{...props}
				className={cx(props.className, styles.header)}
				role="banner"
			>
				<nav className={styles.nav}>
					<div className={styles.homeLinkWrapper}>
						<LinkWrapper className={styles.homeLinkWrapperInner}>
							<Link className={styles.homeLink} href="/">
								<LogoSmall
									aria-hidden
									className={cx(styles.homeLogo, "small")}
								/>
								<LogoLarge
									aria-hidden
									className={cx(styles.homeLogo, "large")}
								/>
								<VisuallyHidden>Chance the Developer</VisuallyHidden>
							</Link>{" "}
						</LinkWrapper>
					</div>
					{/* <NavMenu className={styles.menu}>
					<StyledMenuItem>
						<StyledMenuLink href="/">
							Blog
						</StyledMenuLink>
					</StyledMenuItem>
					<StyledMenuItem>
						<StyledMenuLink href="/">
							About
						</StyledMenuLink>
					</StyledMenuItem>
				</NavMenu> */}
				</nav>
				<ClientOnly>
					<DarkModeSwitch className={styles.darkModeSwitch} />
				</ClientOnly>

				{/* <ThemeToggle /> */}
			</header>
		);
	}
);

Header.displayName = "Header";
export { Header };
