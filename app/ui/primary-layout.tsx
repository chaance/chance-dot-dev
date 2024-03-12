import * as React from "react";
import cx from "clsx";
import { SocialNav } from "./social-nav.js";
import { SiteHeader } from "./site-header.js";
import styles from "./primary-layout.module.css";
import { SiteFooter } from "./site-footer.js";

interface PrimaryLayoutProps {
	children?: React.ReactNode;
}

export function PrimaryLayout(props: PrimaryLayoutProps) {
	const { children } = props;
	return (
		<div className={styles.layout}>
			<div className={styles.header}>
				<SiteHeader />
			</div>
			<div className={styles.main}>
				<div className={styles.mainInner}>{children}</div>
			</div>
			<div className={styles.footer}>
				<SiteFooter />
			</div>
		</div>
	);
}
