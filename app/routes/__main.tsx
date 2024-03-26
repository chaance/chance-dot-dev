import * as React from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PrimaryLayout } from "~/ui/primary-layout";
import "./__main.css";

const ROOT_CLASS = "layout--main";

export default function MainLayout() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}
