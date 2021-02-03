import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { NavMenu, NavMenuItem, NavMenuLink } from "$components/nav-menu";
import { P } from "$components/html";
import { cx } from "$lib/utils";
const styles = require("./footer.module.scss");

const StyledMenuItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentProps<typeof NavMenuItem>
>((props, ref) => (
	<NavMenuItem {...props} ref={ref} className={styles.navMenuItem} />
));
const StyledMenuLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithRef<typeof NavMenuLink>
>((props, ref) => (
	<NavMenuLink {...props} ref={ref} className={styles.menuLink} />
));

const Footer = React.forwardRef<HTMLElement, React.ComponentProps<"footer">>(
	function Footer({ ...props }, forwardedRef) {
		return (
			<footer
				ref={forwardedRef}
				{...props}
				className={cx(props.className, styles.footer)}
				role="contentinfo"
			>
				<div className={styles.inner}>
					<nav>
						<NavMenu className={styles.menu}>
							<StyledMenuItem>
								<StyledMenuLink href="https://twitter.com/chancethedev/">
									<VisuallyHidden>Follow Chance on </VisuallyHidden>Twitter
								</StyledMenuLink>
							</StyledMenuItem>
							<StyledMenuItem>
								<StyledMenuLink href="https://www.linkedin.com/in/chaance/">
									<VisuallyHidden>Follow Chance on </VisuallyHidden>LinkedIn
								</StyledMenuLink>
							</StyledMenuItem>
							<StyledMenuItem>
								<StyledMenuLink href="https://www.github.com/chaance/">
									<VisuallyHidden>Follow Chance on </VisuallyHidden>GitHub
								</StyledMenuLink>
							</StyledMenuItem>
						</NavMenu>
					</nav>
					<div>
						<P className={styles.copyright}>
							<span>{`\u00A9 ${new Date().getFullYear()}`}</span>
						</P>
					</div>
				</div>
			</footer>
		);
	}
);

Footer.displayName = "Footer";
export { Footer };
