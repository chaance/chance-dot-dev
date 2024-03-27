import * as React from "react";
import { SiteHeader } from "./site-header.js";
import { SiteFooter } from "./site-footer.js";

interface PrimaryLayoutProps {
	children?: React.ReactNode;
}

export function PrimaryLayout(props: PrimaryLayoutProps) {
	const { children } = props;
	return (
		<div className="PrimaryLayout">
			<div className="PrimaryLayout__header">
				<SiteHeader />
			</div>
			<div className="PrimaryLayout__main">
				<div className="PrimaryLayout__main-inner">{children}</div>
			</div>
			<div className="PrimaryLayout__footer">
				<SiteFooter />
			</div>
		</div>
	);
}
