import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { serverSessionStorage } from "~/lib/session.server";
import { isString } from "~/lib/utils";

const STATUS_ENABLED = "enabled";
const STATUS_DISABLED = "disabled";
const SESSION_KEY = "scripts";

export async function loader() {
	return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
	let [session, formData] = await Promise.all([
		serverSessionStorage.getSession(request.headers.get("Cookie")),
		request.formData(),
	]);

	let redirectTo = "/";
	try {
		let _redirect = formData.get("_redirect");
		if (isString(_redirect)) {
			let requestUrl = new URL(request.url);
			let redirectUrl = new URL(_redirect, requestUrl.origin);
			redirectTo = redirectUrl.pathname;
		}
	} catch (_) {}

	let scripts = formData.get("scripts");
	let toggle = formData.get("toggle");
	if (toggle === null) {
		scripts = STATUS_DISABLED;
	} else if (toggle === "on") {
		scripts = STATUS_ENABLED;
	}

	if (scripts === STATUS_ENABLED || scripts === STATUS_DISABLED) {
		session.set(SESSION_KEY, scripts);
		return redirect(redirectTo, {
			headers: {
				"Set-Cookie": await serverSessionStorage.commitSession(session),
			},
		});
	}
	return redirect(redirectTo, { status: 400 });
}
