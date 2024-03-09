import * as React from "react";
import { Outlet } from "@remix-run/react";
import "~/dist/styles/routes/__auth.css";

export default function AuthLayout() {
	return (
		<div className="auth-layout container">
			<Outlet />
		</div>
	);
}
