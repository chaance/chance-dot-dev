import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Container } from "~/ui/container";
import { getMarkdownBlogPost, type MarkdownBlogPost } from "~/lib/blog.server";
import type {
	HeadersFunction,
	V2_MetaFunction as MetaFunction,
	LoaderArgs,
} from "@remix-run/node";
import { isAbsoluteUrl, unSlashIt } from "~/lib/utils";

import routeStylesUrl from "~/dist/styles/routes/__main/blog/_slug.css";
import invariant from "tiny-invariant";
import { getSessionUser } from "~/lib/session.server";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "page--blog";

interface PostData extends MarkdownBlogPost {
	createdAtFormatted: string;
	createdAtISO: string;
	updatedAtFormatted: string | null;
	updatedAtISO: string | null;
}

export async function loader({ params, request }: LoaderArgs) {
	invariant(params.slug, "Slug is required");
	let [user, post] = await Promise.all([
		getSessionUser(request),
		getMarkdownBlogPost(params.slug),
	]);

	let headers = {
		"Cache-Control": user
			? "no-cache"
			: "public, max-age=300, s-maxage=300, stale-while-revalidate=604800",
	};

	if (!post) {
		throw json(null, { status: 404, headers });
	}

	let createdAt = new Date(post.createdAt);
	let updatedAt = post.updatedAt && new Date(post.updatedAt);

	let fullPost: PostData = {
		...post,
		title: post.title.replace(/&colon;/g, ":"),
		createdAtFormatted: createdAt.toLocaleString("en-us", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "America/Los_Angeles",
		}),
		createdAtISO: createdAt.toISOString(),
		updatedAtFormatted:
			updatedAt &&
			updatedAt.toLocaleString("en-us", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "America/Los_Angeles",
			}),
		updatedAtISO: updatedAt && updatedAt.toISOString(),
	};

	let requestUrl = new URL(request.url);
	let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

	return json({ post: fullPost, user, siteUrl }, { headers });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) {
		return getSeoMeta(DEFAULT_METADATA);
	}

	const { siteUrl, post } = data;
	let { title, description, seo, slug, createdAtFormatted } = post;

	let url = `${siteUrl}/blog/${slug}`;
	let socialImageUrl = `${siteUrl}/img/social?${new URLSearchParams({
		slug,
		siteUrl,
		title,
		authorName: "Chance Strickland",
		authorTitle: "chance.dev",
		date: createdAtFormatted,
	})}`;

	const twitterImageUrl = seo?.twitterCard
		? isAbsoluteUrl(seo.twitterCard)
			? seo.twitterCard
			: `${siteUrl}/${unSlashIt(seo.twitterCard)}`
		: socialImageUrl;

	return getSeoMeta({
		...DEFAULT_METADATA,
		title,
		description,
		openGraph: {
			url,
			images: [
				{
					url: socialImageUrl,
					alt: title,
				},
			],
		},
		twitter: {
			...DEFAULT_METADATA.twitter,
			image: {
				url: twitterImageUrl,
				alt: title,
			},
			creator: seo?.twitterCreator || DEFAULT_METADATA.twitter?.creator,
			site: seo?.twitterSite || DEFAULT_METADATA.twitter?.site,
		},
	});
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control")!,
		Vary: "Cookie",
	};
};

export default function BlogPostRoute() {
	let { post, user } = useLoaderData<typeof loader>();

	return (
		<div className={ROOT_CLASS}>
			<main className={`${ROOT_CLASS}__main`}>
				<article className={`${ROOT_CLASS}__article`}>
					<Container>
						<header className={`${ROOT_CLASS}__header`}>
							<h1 className={`${ROOT_CLASS}__title`}>{post.title}</h1>
							{/* post.description ? (
								<p _className="text-lg xl:text-xl" className={`${ROOT_CLASS}__desc`}>{post.description}</p>
							) : null */}
							<p className={`${ROOT_CLASS}__meta`}>
								<span>Posted on </span>
								<time dateTime={post.createdAtISO}>
									{post.createdAtFormatted}
								</time>
								{post.updatedAtISO &&
								new Date(post.updatedAtISO) > new Date(post.createdAtISO) ? (
									<>
										; <span>Updated on </span>
										<time dateTime={post.updatedAtISO}>
											{post.updatedAtFormatted}
										</time>
									</>
								) : null}

								{user ? (
									<>
										; <Link to={`/admin/blog/${post.id}`}>Edit Post</Link>
									</>
								) : null}
							</p>
						</header>
					</Container>
					<Container>
						<MacOsWindow>
							<div
								className={`${ROOT_CLASS}__content prose prose-markdown`}
								dangerouslySetInnerHTML={{
									__html: post.bodyHTML,
								}}
							/>
						</MacOsWindow>
					</Container>
				</article>
			</main>
		</div>
	);
}

// type Mark = RichTextContent["marks"][number]["type"];

// function decorateChild(
// 	node: RichTextContent,
// 	child: React.ReactNode
// ): React.ReactNode {
// 	let marks = node.marks.reduce<Record<Mark, boolean>>(
// 		(allMarks, mark) => ({
// 			...allMarks,
// 			[mark.type]: true,
// 		}),
// 		{ bold: false, underline: false, code: false, italic: false }
// 	);

// 	if (marks.bold) {
// 		child = <strong>{child}</strong>;
// 	}

// 	if (marks.italic) {
// 		child = <em>{child}</em>;
// 	}

// 	if (marks.underline) {
// 		child = <span className="underline">{child}</span>;
// 	}

// 	if (marks.code) {
// 		child = <code>{child}</code>;
// 	}

// 	return child;
// }

function MacOsWindow({ children }: { children: React.ReactNode }) {
	const ROOT_CLASS = "macos-window";
	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__topbar`}>
				<div className={`${ROOT_CLASS}__topbar-inner`}>
					<div className={`${ROOT_CLASS}__actions`}>
						<div className={`${ROOT_CLASS}__action-button`} />
						<div className={`${ROOT_CLASS}__action-button`} />
						<div className={`${ROOT_CLASS}__action-button`} />
					</div>
				</div>
			</div>
			{children}
		</div>
	);
}
