import * as React from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import "~/dist/styles/routes/__main.css";

const ROOT_CLASS = "layout--main";

export default function MainLayout() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}

export function PrimaryLayout({ children }: React.PropsWithChildren) {
	let location = useLocation();
	let isAbsolute = location.pathname === "/";
	const headerRef = React.useRef<HTMLElement>(null);
	const mainRef = React.useRef<HTMLDivElement>(null);
	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__header`}>
				<SiteHeader
					position={isAbsolute ? "absolute" : "sticky"}
					includeBottomMargin={!isAbsolute}
					containerRef={headerRef}
				/>
			</div>
			<div className={`${ROOT_CLASS}__main`} ref={mainRef}>
				{children}
			</div>
			<div className={`${ROOT_CLASS}__footer`}>
				<SiteFooter />
			</div>
		</div>
	);
}
