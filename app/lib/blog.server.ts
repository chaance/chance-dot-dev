import path from "path";
import { parseMarkdown } from "~/lib/md.server";
import {
	type BlogPost,
	type BlogPostWithSEO,
	getBlogPostBySlug as getBlogPostBySlugFromDB,
	getBlogPostListItems as getBlogPostListItemsFromDB,
} from "~/models/blog-post.server";
import { getExcerpt } from "~/lib/utils";

export async function getMarkdownBlogPost(slug: string) {
	let blogPost = await getBlogPostBySlugFromDB(slug);
	if (!blogPost) {
		return null;
	}

	let markdown = await getProcessedMarkdown(blogPost.slug, blogPost.body);
	if (!markdown) {
		return null;
	}

	let { body, ...blogPostData } = blogPost;

	let post: MarkdownBlogPost = {
		...blogPostData,
		bodyRaw: body,
		bodyHTML: markdown.html,
		bodyMarkdown: markdown.markdown,
	};
	return post;
}

export async function getMarkdownBlogPostListItems({
	limit = 10,
	offset = 0,
	userId = null,
}: {
	limit?: number;
	offset?: number;
	userId?: string | null;
} = {}) {
	let blogPosts = await getBlogPostListItemsFromDB({ limit, offset, userId });
	if (blogPosts.length === 0) {
		return [];
	}

	let processes: Promise<ProcessedMarkdown<null> | null>[] = [];
	for (let blogPost of blogPosts) {
		let excerpt =
			blogPost.excerpt || getExcerpt(blogPost.description || blogPost.body, 20);
		blogPost.excerpt = excerpt;
		let process = getProcessedMarkdown(blogPost.slug, excerpt);
		processes.push(process);
	}

	let processedItems = await Promise.all(processes);

	let posts: MarkdownBlogPostWithExcerpt[] = [];
	for (let i = 0; i < processedItems.length; i++) {
		let processed = processedItems[i];
		if (!processed) {
			continue;
		}

		let blogPost = blogPosts[i];
		let { body, excerpt, ...blogPostData } = blogPost;
		let post: MarkdownBlogPostWithExcerpt = {
			...blogPostData,
			excerptRaw: blogPost.excerpt!, // assertion only safe because we set it in the loop above
			excerptHTML: processed.html,
			excerptMarkdown: processed.markdown,
		};
		posts.push(post);
	}

	return posts;
}

export function getSlugFromPath(filePath: string) {
	return new RegExp(`${path.sep}index.md$`).test(filePath)
		? path.basename(path.dirname(filePath))
		: path.basename(filePath, ".md");
}

export interface ProcessedMarkdown<Frontmatter = unknown> {
	key: string;
	frontmatter: Frontmatter;
	markdown: string;
	html: string;
}

export interface MarkdownBlogPostWithExcerpt
	extends Omit<BlogPost, "body" | "excerpt"> {
	excerptRaw: string;
	excerptMarkdown: string;
	excerptHTML: string;
}

export interface MarkdownBlogPost extends Omit<BlogPostWithSEO, "body"> {
	bodyRaw: string;
	bodyMarkdown: string;
	bodyHTML: string;
}

export async function getProcessedMarkdown(slug: string, contents: string) {
	let result = await parseMarkdown(slug, contents);
	if (!result) {
		return null;
	}

	let { html, markdown } = result;

	let post: ProcessedMarkdown<null> = {
		frontmatter: null,
		html,
		key: slug,
		markdown,
	};
	return post;
}
