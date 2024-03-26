import * as React from "react";
import cx from "clsx";
import { SocialNav } from "./social-nav.js";
import { SiteHeader } from "./site-header.js";
import styles from "./primary-layout.module.css";
import { SiteFooter } from "./site-footer.js";
import { useLocation } from "@remix-run/react";

interface PrimaryLayoutProps {
	children?: React.ReactNode;
}

export function PrimaryLayout(props: PrimaryLayoutProps) {
	const { children } = props;
	const location = useLocation();
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
