import * as React from "react";
import styles from "~/ui/site-footer.module.css";
import cx from "clsx";
import { SocialNav } from "./social-nav";
import { useRootContext } from "~/lib/react/context";

export function SiteFooter() {
	const ctx = useRootContext();
	return (
		<footer className={cx(styles.footer, "flex flex-col mt-8 gap-2")}>
			<div className="md:hidden">
				<SocialNav />
			</div>
			<p className={cx(styles.copyright, "text-sm text-weaker")}>
				&copy; {ctx.currentYear}. Zero rights reserved.
			</p>
		</footer>
	);
}
