import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import { Link } from "~/ui/primitives/link";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMarkdownBlogPostListItems } from "~/lib/blog.server";
import { isLocalHost } from "~/lib/utils";

import routeStyles from "./index.css?url";
export function links() {
	return [{ rel: "stylesheet", href: routeStyles }];
}

export async function loader({ request }: LoaderFunctionArgs) {
	// TODO: Implement CDN caching
	let headers: HeadersInit = isLocalHost(new URL(request.url))
		? {}
		: {
				"Cache-Control":
					"public, max-age=300, s-maxage=300, stale-while-revalidate=604800",
			};
	try {
		let rawPosts = await getMarkdownBlogPostListItems();
		if (!rawPosts) {
			throw new Response("Not found", {
				status: 404,
				headers,
			});
		}

		return json(
			{
				posts: rawPosts
					.map((post) => {
						const createdAt = new Date(post.createdAt);
						const updatedAt = new Date(post.updatedAt);
						let date = createdAt;
						if (post.createdAt.getTime() !== post.updatedAt.getTime()) {
							date = updatedAt;
						}

						return {
							id: post.id,
							slug: post.slug,
							title: post.title,
							description: post.description,
							excerptRaw: post.excerptRaw,
							date,
							dateFormatted: date.toLocaleString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
								timeZone: "America/Los_Angeles",
							}),
							dateISO: date.toISOString(),
						};
					})
					.sort((a, b) => b.date.getTime() - a.date.getTime()),
			},
			{ headers },
		);
	} catch (error) {
		// TODO: handle query errors
		throw error;
	}

	function toLocaleDateString(date: Date) {
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
}

export function meta() {
	return getSeoMeta(DEFAULT_METADATA);
}

export default function HomeRoute() {
	let { posts } = useLoaderData<typeof loader>();
	return (
		<main className="homepage">
			<h1 className="sr-only">Chance the Dev</h1>
			<h2 className="homepage__heading text-h3 mb-10">Latest Articles</h2>
			<div className="Articles">
				{posts.map((post) => {
					let excerpt = post.excerptRaw || post.description;
					if (excerpt && !excerpt.endsWith(".")) {
						excerpt += ".";
					}
					return (
						<article key={post.id} className="Articles__post">
							<div className="Articles__post-header">
								<h3 className="Articles__post-title text-h2">
									<Link className="flex" to={`/blog/${post.slug}`}>
										{post.title}
									</Link>
								</h3>
								<div className="Articles__post-meta text-sm text-weaker">
									<time dateTime={post.dateISO}>{post.dateFormatted}</time>
								</div>
							</div>
							<div className="Articles__post-content">
								<div>{excerpt}</div>
							</div>
						</article>
					);
				})}
			</div>
		</main>
	);
}
