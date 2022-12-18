import { Outlet, useLocation } from "@remix-run/react";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";

import routeStylesUrl from "~/dist/styles/routes/__main.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "layout--main";

export default function MainLayout() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}

export function PrimaryLayout({ children }: React.PropsWithChildren<{}>) {
	let location = useLocation();
	let isAbsolute = location.pathname === "/";
	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__header`}>
				<SiteHeader
					position={isAbsolute ? "absolute" : "sticky"}
					includeBottomMargin={!isAbsolute}
				/>
			</div>
			<div className={`${ROOT_CLASS}__main`}>{children}</div>
			<div className={`${ROOT_CLASS}__footer`}>
				<SiteFooter includeTopMargin={false} />
			</div>
		</div>
	);
}
