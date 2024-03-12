import { redirect } from "@remix-run/node";

export function loader() {
	// TODO Eventually the homepage will no longer be the blog so we can remove
	// the redirect when that's updated
	return redirect("/", 307);
}
