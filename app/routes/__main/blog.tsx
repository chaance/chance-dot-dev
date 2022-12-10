import * as React from "react";
import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSessionUser } from "~/lib/session.server";

export async function loader(args: LoaderArgs) {
	let user = await getSessionUser(args.request);
	return json({ user });
}

export default function PrimaryLayoutRoute() {
	return <Outlet />;
}
