import * as React from "react";
import type { LoaderArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserId } from "~/lib/session.server";
import routeStylesUrl from "~/dist/styles/routes/__auth.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

// export async function loader({ request }: LoaderArgs) {
// 	let userId = await getUserId(request);
// 	if (!userId) {
// 		return redirect("/login");
// 	}
// 	return json(null);
// }

export default function AuthLayout() {
	return (
		<div className="auth-layout container">
			<Outlet />
		</div>
	);
}
