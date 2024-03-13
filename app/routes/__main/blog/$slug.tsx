import * as React from "react";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getMarkdownBlogPost, type MarkdownBlogPost } from "~/lib/blog.server";
import type {
	HeadersFunction,
	MetaFunction,
	LoaderFunctionArgs,
} from "@remix-run/node";
import { isAbsoluteUrl, isLocalHost, unSlashIt } from "~/lib/utils";
import cx from "clsx";
import invariant from "tiny-invariant";
import { getSessionUser } from "~/lib/session.server";
import { DEFAULT_METADATA, getSeoMeta } from "~/lib/seo";
import styles from "./$slug.module.css";

interface PostData extends MarkdownBlogPost {
	createdAtFormatted: string;
	createdAtISO: string;
	updatedAtFormatted: string | null;
	updatedAtISO: string | null;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	invariant(params.slug, "Slug is required");
	let [user, post] = await Promise.all([
		getSessionUser(request),
		getMarkdownBlogPost(params.slug),
	]);

	let headers: HeadersInit = isLocalHost(new URL(request.url))
		? {}
		: {
				"Cache-Control": user
					? "no-cache"
					: "public, max-age=300, s-maxage=300, stale-while-revalidate=604800",
			};

	if (!post) {
		throw json(null, { status: 404, headers });
	}

	const createdAt = new Date(post.createdAt);
	const updatedAt = new Date(post.updatedAt);
	let which = "created";
	let date = createdAt;
	if (post.createdAt.getTime() !== post.updatedAt.getTime()) {
		which = "updated";
		date = updatedAt;
	}

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
		// authorName: "Chance Strickland",
		// authorTitle: "chance.dev",
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
	const contentRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		let buttons: HTMLButtonElement[] = [];
		let timeouts: number[] = [];
		const contentElement = contentRef.current;
		const preTags = contentElement?.querySelectorAll("pre");
		if (!preTags || !preTags.length) {
			return;
		}

		const icons = getCopyIcons();
		for (const preTag of preTags) {
			// create a 'copy' button that will copy the code to the clipboard
			let copyButton = preTag.querySelector<HTMLButtonElement>(".copy-button");
			if (!copyButton) {
				copyButton = document.createElement("button");
				copyButton.textContent = "Copy";
				copyButton.ariaLabel = "Copy code to clipboard";
				copyButton.className = "copy-button";
				copyButton.type = "button";
				copyButton.innerHTML = icons.copy;
				copyButton.title = "Copy code to clipboard";
				preTag.appendChild(copyButton);
			} else {
				// clone to remove event listeners; we're gonna add our own and don't
				// want multiple things happening
				const newButton = copyButton.cloneNode(true);
				copyButton.parentNode!.replaceChild(newButton, copyButton);
				copyButton = newButton as HTMLButtonElement;
			}
			copyButton.addEventListener("click", handleCopyClick);
			buttons.push(copyButton);
		}

		return () => {
			for (const button of buttons) {
				button.removeEventListener("click", handleCopyClick);
			}
			for (const timeout of timeouts) {
				window.clearTimeout(timeout);
			}
		};

		function handleCopyClick(event: MouseEvent) {
			const button = event.currentTarget as HTMLButtonElement;
			const preTag = button.parentElement as HTMLPreElement;
			if (preTag.textContent) {
				navigator.clipboard.writeText(preTag.textContent);
				button.innerHTML = icons.check;
				timeouts.push(
					window.setTimeout(() => {
						button.innerHTML = icons.copy;
					}, 1500),
				);
			}
		}
	}, []);
	return (
		<main className={styles.root}>
			<article className={styles.article}>
				<header className="mb-6">
					<h1 className="text-h1 mb-10">{post.title}</h1>
					<p className="text-sm text-weaker">
						<span>Posted on </span>
						<time dateTime={post.createdAtISO}>{post.createdAtFormatted}</time>
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
				<div
					ref={contentRef}
					className={cx(styles.body, "prose")}
					dangerouslySetInnerHTML={{
						__html: post.bodyHTML,
					}}
				/>
			</article>
		</main>
	);
}

function getCopyIcons() {
	return {
		copy: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
</svg>`,
		check: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>`,
	};
}
