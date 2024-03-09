import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { H1, HeadingLevelProvider } from "~/ui/primitives/heading";
import { Link } from "~/ui/primitives/link";
import { Container } from "~/ui/container";
import { getMarkdownBlogPostListItems } from "~/lib/blog.server";

import routeStylesUrl from "~/dist/styles/routes/__main/blog/index.css";
import { getSessionUser } from "~/lib/session.server";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

export function meta() {
	return getSeoMeta({
		...DEFAULT_METADATA,
		title: "Articles",
	});
}

const ROOT_CLASS = "page--blog-index";

export async function loader({ request }: LoaderFunctionArgs) {
	let user = await getSessionUser(request);
	try {
		// TODO: Implement CDN caching
		let headers = {
			"Cache-Control": user
				? "no-cache"
				: "public, max-age=300, s-maxage=300, stale-while-revalidate=604800",
		};

		let rawPosts = await getMarkdownBlogPostListItems();
		if (!rawPosts) {
			throw new Response("Not found", {
				status: 404,
				headers,
			});
		}

		return json(
			{
				posts: rawPosts.map((post) => {
					let createdAt = new Date(post.createdAt);
					return {
						title: post.title,
						slug: post.slug,
						createdAtFormatted: createdAt.toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							timeZone: "America/Los_Angeles",
						}),
						createdAtISO: createdAt.toISOString(),
					};
				}),
			},
			{ headers }
		);
	} catch (error) {
		// TODO: handle query errors
		throw error;
	}
}

export let headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control")!,
	};
};

export default function BlogIndex() {
	let { posts } = useLoaderData<typeof loader>();

	return (
		<main className={ROOT_CLASS}>
			<h1 className="sr-only">Welcome to chance.dev</h1>
			<Container>
				<HeadingLevelProvider>
					<H1 className={`${ROOT_CLASS}__title`}>Notes</H1>
					<div className={`${ROOT_CLASS}__inner`}>
						{posts.map((post) => {
							return <BlogArticle key={post.slug} {...post} />;
						})}
					</div>
				</HeadingLevelProvider>
			</Container>
		</main>
	);
}

function BlogArticle(props: FeedPost) {
	const ROOT_CLASS = "blog-article";
	return (
		<article className={ROOT_CLASS}>
			<header className={`${ROOT_CLASS}__header`}>
				<h2 className={`${ROOT_CLASS}__title`}>
					<Link
						className={`${ROOT_CLASS}__title-link`}
						to={props.slug}
						rel="bookmark"
					>
						{props.title}
					</Link>
				</h2>
				<p className={`${ROOT_CLASS}__meta`}>
					<span>Posted on </span>
					<time dateTime={props.createdAtISO}>{props.createdAtFormatted}</time>
				</p>
			</header>
		</article>
	);
}

interface FeedPost {
	title: string;
	slug: string;
	createdAtISO: string;
	createdAtFormatted: string;
}
