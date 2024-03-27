import * as React from "react";
import { Outlet } from "@remix-run/react";

import routeStyles from "./__auth.css?url";
export function links() {
	return [{ rel: "stylesheet", href: routeStyles }];
}

export default function AuthLayout() {
	return (
		<div className="auth-layout container">
			<Outlet />
		</div>
	);
}
