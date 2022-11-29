import LRUCache from "lru-cache";
import path from "path";
import { parseMarkdown } from "~/lib/md.server";
import {
	type BlogPost,
	type BlogPostWithSEO,
	getBlogPostBySlug as getBlogPostBySlugFromDB,
	getBlogPostListItems as getBlogPostListItemsFromDB,
} from "~/models/blog-post.server";
import { getExcerpt, typedBoolean } from "~/lib/utils";

const postCache = new LRUCache<string, MarkdownBlogPost>({
	max: Math.round((1024 * 1024 * 12) / 10),
	maxSize: 1024 * 1024 * 12, // 12mb
	sizeCalculation(value, key) {
		return JSON.stringify(value).length + (key ? key.length : 0);
	},
});

const postListCache = new LRUCache<string, MarkdownBlogPostWithExcerpt[]>({
	max: Math.round((1024 * 1024 * 12) / 10),
	maxSize: 1024 * 1024 * 12, // 12mb
	sizeCalculation(value, key) {
		return JSON.stringify(value).length + (key ? key.length : 0);
	},
});

async function getCachedMarkdownBlogPost(slug: string) {
	let cached = postCache.get(slug);
	if (cached) {
		return cached;
	}

	let post = await getMarkdownBlogPost(slug);
	if (!post) {
		return null;
	}
	postCache.set(slug, post);
	return post;
}

async function getMarkdownBlogPost(slug: string) {
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

export { getCachedMarkdownBlogPost as getMarkdownBlogPost };

async function getMarkdownBlogPostListItems({
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

async function getMarkdownBlogPostListItemsCached({
	limit = 10,
	offset = 0,
	userId = null,
}: {
	limit?: number;
	offset?: number;
	userId?: string | null;
} = {}) {
	let key = ["list", limit, offset, userId ?? "all"].join("-");
	let cached = postListCache.get(key);
	if (cached) {
		return cached;
	}

	let posts = await getMarkdownBlogPostListItems();
	postListCache.set(key, posts);
	return posts;
}

export { getMarkdownBlogPostListItemsCached as getMarkdownBlogPostListItems };

export async function getMarkdownBlogPosts() {
	let blogPosts = await getBlogPostListItemsFromDB();
	let listingPromises: Array<Promise<MarkdownBlogPost | null>> = [];
	for (let post of blogPosts) {
		listingPromises.push(getCachedMarkdownBlogPost(post.slug));
	}

	let listings = (await Promise.all(listingPromises)).filter(typedBoolean);

	return listings.sort((a, b) => {
		let bTime = new Date(b.createdAt).getTime();
		let aTime = new Date(a.createdAt).getTime();
		return bTime - aTime;
	});
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
