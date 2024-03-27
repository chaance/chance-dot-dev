import type { ErrorResponse } from "@remix-run/router";
import {
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getMarkdownBlogPost } from "~/lib/blog.server";

export async function loader({ params }: LoaderFunctionArgs) {
	const possibleSlug = params["*"];
	if (possibleSlug) {
		let post = await getMarkdownBlogPost(possibleSlug).catch(() => null);
		if (post) {
			return redirect(`/blog/${post.slug}`);
		}
	}
	throw json(null, 404);
}

export const meta: MetaFunction<typeof loader> = ({ error }) => {
	if (error) {
		let title = "Oh no!";
		if (isRouteErrorResponse(error)) {
			title += ` ${error.status}!`;
		}
		return [{ title }];
	}
	return [];
};

export default function CatchAll() {
	return null;
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (process.env.NODE_ENV === "development") {
		console.error("MAIN LAYOUT ERROR BOUNDARY: ", error);
	}

	let message;
	if (isRouteErrorResponse(error)) {
		switch (error.status) {
			case 401:
				message = (
					<p>
						It looks like you tried to visit a page that you do not have access
						to.
					</p>
				);
				break;
			case 404:
				message = (
					<p>
						Oops! It looks like you tried to visit a page that does not exist.
					</p>
				);
				break;

			default:
				throw new Error(error.data || error.statusText);
		}
	} else {
		message = (
			<p>
				Something went wrong and I'm not quite sure what! Maybe go outside for a
				bit and hopefully I'll get it fixed by the time you get back.
			</p>
		);
	}

	return (
		<main>
			<div>
				<div className="prose">
					<h1>Oh no!</h1>
					<div>{message}</div>
					<p>
						<Link to="/">Go back home</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
