import * as React from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PrimaryLayout } from "~/ui/primary-layout";
import stylesheetUrl from "./__main.css?url";

export function links() {
	return [{ rel: "stylesheet", href: stylesheetUrl }];
}

const ROOT_CLASS = "layout--main";

export default function MainLayout() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}
