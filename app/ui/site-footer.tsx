import * as React from "react";
import { SocialNav } from "./social-nav";
import { useRootContext } from "~/lib/react/context";

export function SiteFooter() {
	const ctx = useRootContext();
	return (
		<footer className="SiteFooter">
			<div className="md:hidden">
				<SocialNav />
			</div>
			<p className="SiteFooter__copyright text-sm text-weaker">
				&copy; {ctx.currentYear}. Zero rights reserved.
			</p>
		</footer>
	);
}
