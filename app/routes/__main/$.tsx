import { data } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect } from "react-router";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { getMarkdownBlogPost } from "~/lib/blog.server";
import { RouteErrorLogger } from "~/lib/route-error-logger";

export async function loader({ params }: LoaderFunctionArgs) {
	const possibleSlug = params["*"];
	if (possibleSlug) {
		let post = await getMarkdownBlogPost(possibleSlug).catch(() => null);
		if (post) {
			return redirect(`/blog/${post.slug}`);
		}
	}
	throw data(null, 404);
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
	const isRouteError = isRouteErrorResponse(error);

	const { message, heading }: { message: React.ReactNode; heading: string } =
		(() => {
			if (isRouteError) {
				switch (error.status) {
					case 401:
						return {
							heading: "Unauthorized",
							message: (
								<p>
									It looks like you tried to visit a page that you do not have
									access to.
								</p>
							),
						};

					case 404:
						return {
							heading: "Not Found",
							message: (
								<p>
									Oops! It looks like you tried to visit a page that does not
									exist.
								</p>
							),
						};

					default:
						throw new Error(error.data || error.statusText);
				}
			} else {
				return {
					heading: "Something went wrong",
					message: (
						<p>
							Something went wrong and I'm not quite sure what! Maybe go outside
							for a bit and hopefully I'll get it fixed by the time you get
							back.
						</p>
					),
				};
			}
		})();

	return (
		<main>
			<div>
				<div className="prose">
					<h1>{heading}</h1>
					<div>{message}</div>
					<p>
						<Link to="/">Go back home</Link>
					</p>
				</div>
			</div>
			<RouteErrorLogger error={error} boundaryName="root" />
		</main>
	);
}
