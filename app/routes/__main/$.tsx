import type { ErrorResponse } from "@remix-run/router";
import { json } from "@remix-run/node";
import { isRouteErrorResponse } from "@remix-run/react";
import { Container } from "~/ui/container";
import "~/dist/styles/routes/__main/$.css";

const ROOT_CLASS = "page--main-catchall";

export async function loader() {
	throw json(null, 404);
}

export default function CatchAll() {
	return null;
}

export function ErrorBoundary({ error }: { error: unknown }) {
	if (process.env.NODE_ENV === "development") {
		console.error("MAIN LAYOUT ERROR BOUNDARY: ", error);
	}

	if (isRouteErrorResponse(error)) {
		return <CatchBoundary caught={error} />;
	}

	return (
		<main className={ROOT_CLASS}>
			<Container>
				<h1 className={`${ROOT_CLASS}__title`}>Oh no!</h1>
				<div className={`${ROOT_CLASS}__message`}>
					<p>
						Something went wrong and I'm not quite sure what! Maybe go outside
						for a bit and hopefully I'll get it fixed by the time you get back.
					</p>
				</div>
			</Container>
		</main>
	);
}

export function CatchBoundary({ caught }: { caught: ErrorResponse }) {
	let message;
	switch (caught.status) {
		case 401:
			message = (
				<p>
					Oops! It looks like you tried to visit a page that you do not have
					access to.
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
			throw new Error(caught.data || caught.statusText);
	}

	return (
		<main className={ROOT_CLASS}>
			<Container>
				<h1 className={`${ROOT_CLASS}__title`}>Oh no!</h1>
				<div className={`${ROOT_CLASS}__message`}>{message}</div>
			</Container>
		</main>
	);
}
