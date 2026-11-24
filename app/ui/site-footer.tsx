import * as React from "react";
import { SocialNav } from "./social-nav";
import { useRootContext } from "~/ui/root-context";

export function SiteFooter() {
	const ctx = useRootContext();
	return (
		<footer className="SiteFooter">
			<div className="SiteFooter__social">
				<SocialNav />
			</div>
			<p className="SiteFooter__copyright text-sm text-weaker">
				&copy; {ctx.currentYear}. Zero rights reserved.
			</p>
		</footer>
	);
}
