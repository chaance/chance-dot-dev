import * as React from "react";
import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import routeStylesUrl from "~/dist/styles/routes/__auth.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export default function AuthLayout() {
	return (
		<div className="auth-layout container">
			<Outlet />
		</div>
	);
}
