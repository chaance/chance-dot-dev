import * as React from "react";
import { Outlet } from "@remix-run/react";
import stylesheetUrl from "./__auth.css?url";

export function links() {
	return [{ rel: "stylesheet", href: stylesheetUrl }];
}

export default function AuthLayout() {
	return (
		<div className="auth-layout container">
			<Outlet />
		</div>
	);
}
