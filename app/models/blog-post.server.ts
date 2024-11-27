import type {
	// User,
	BlogPost as DBBlogPost,
	// SEO as DBSEO,
} from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { slugify } from "~/lib/utils";
import type { ArrayOfKeys } from "~/types";

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	excerpt: string | null;
	body: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
}

export interface BlogPostWithSEO extends BlogPost {
	seo: SEO | null;
}

export interface SEO {
	twitterCard: string | null;
	twitterSite: string | null;
	twitterCreator: string | null;

	// metaTitle: string | null;
	// metaDescription: string | null;
	// metaImage: string | null;
	// robots: string | null;
	// canonical: string | null;
	// ogTitle: string | null;
	// ogDescription: string | null;
	// ogImage: OGImage[] | null;
	// ogAudio: OGAudio[] | null;
	// ogVideo: OGVideo[] | null;
}

export interface OGMedia {
	url: string;
	secureUrl: string | null;
}

export interface OGImage extends OGMedia {
	alt: string | null;
	width: number | null;
	height: number | null;
}

export interface OGAudio extends OGMedia {
	type: string | null;
}

export interface OGVideo extends OGMedia {
	type: string | null;
	width: number | null;
	height: number | null;
}

export async function getBlogPost(
	id: string,
	userId?: string,
): Promise<BlogPostWithSEO | null> {
	let post = await prisma.blogPost.findFirst({
		where: userId ? { userId, id } : { id },
		// include: { seo: true },
	});
	return post ? modelBlogPostWithSEO(post) : null;
}

export async function getBlogPostBySlug(
	slug: string,
	userId?: string,
): Promise<BlogPostWithSEO | null> {
	let post = await prisma.blogPost.findFirst({
		where: userId ? { userId, slug } : { slug },
		// include: { seo: true },
	});
	return post ? modelBlogPostWithSEO(post) : null;
}

export async function getBlogPostListItems<
	Selection extends ArrayOfKeys<BlogPost> | null = null,
>({
	limit = 10,
	offset = 0,
	userId = null,
	select,
}: {
	limit?: number;
	offset?: number;
	userId?: string | null;
	select?: Selection | null;
} = {}): Promise<PostSelector<BlogPost, Selection>> {
	let opts: Parameters<typeof prisma.blogPost.findMany>[0] = {
		take: limit,
		skip: offset,
	};
	if (userId) {
		opts.where = { userId };
	}
	if (select) {
		opts.select = {};
		for (let key of select) {
			opts.select[key] = true;
		}
	}

	let posts = await prisma.blogPost.findMany(opts);
	// TODO: No idea if it's really possible or worth the time to make this
	// typesafe, so...yolo
	return posts.map((post) => {
		let result: any = {};
		for (let key of Object.keys(post)) {
			result[key] = (post as any)[key] || null;
		}
		return result;
	}) as any;
}

export async function createBlogPost({
	body,
	title,
	description,
	excerpt,
	userId,
	slug,
	seo,
	createdAt,
	updatedAt,
}: {
	body: string;
	title: string;
	userId: string;
	description?: string | null;
	excerpt?: string | null;
	slug?: string | null;
	seo?: Partial<Omit<SEO, "id">> | null;
	createdAt?: Date;
	updatedAt?: Date;
}): Promise<BlogPostWithSEO> {
	slug = slugify(slug || title);
	let twitterCard = seo?.twitterCard ?? null;
	let twitterSite = seo?.twitterSite ?? null;
	let twitterCreator = seo?.twitterCreator ?? null;
	let blogPost = await prisma.blogPost.create({
		data: {
			title,
			body,
			description,
			excerpt,
			slug,
			twitterCard,
			twitterCreator,
			twitterSite,
			createdAt,
			updatedAt,
			// seo: {
			// 	create: {
			// 		metaTitle: seo?.metaTitle,
			// 		metaDescription: seo?.metaDescription,
			// 		...seo,
			// 		ogImage:
			// 			seo?.ogImage && seo.ogImage.length > 0
			// 				? { create: seo.ogImage }
			// 				: undefined,
			// 		ogAudio:
			// 			seo?.ogAudio && seo?.ogAudio.length > 0
			// 				? { create: seo.ogAudio }
			// 				: undefined,
			// 		ogVideo:
			// 			seo?.ogVideo && seo?.ogVideo.length > 0
			// 				? { create: seo?.ogVideo }
			// 				: undefined,
			// 	},
			// },
			user: {
				connect: {
					id: userId,
				},
			},
		},
		include: { user: true },
	});
	return modelBlogPostWithSEO(blogPost);
}

type BlogPostUpdateData = {
	body?: string;
	title?: string;
	description?: string | null;
	excerpt?: string | null;
	slug?: string | null;
	twitterCard?: string | null;
	twitterSite?: string | null;
	twitterCreator?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export async function updateBlogPost(
	id: string,
	{
		slug,
		...props
	}: {
		body?: string;
		title?: string;
		description?: string | null;
		excerpt?: string | null;
		slug?: string | null;
		createdAt?: Date;
		updatedAt?: Date;
		seo?: {
			twitterCard?: string | null;
			twitterSite?: string | null;
			twitterCreator?: string | null;
		};
	},
): Promise<BlogPostWithSEO> {
	if (slug == "" && props.title) {
		slug = slugify(props.title);
	} else if (slug != null) {
		slug = slugify(slug);
	} else {
		slug = undefined;
	}
	let data: BlogPostUpdateData & { slug: string | undefined } = { slug };

	if (props.seo != null) {
		for (let key of ["twitterCard", "twitterSite", "twitterCreator"] as const) {
			if (props.seo[key] !== undefined) {
				data[key] = props.seo[key];
			}
		}
	}

	if (props.createdAt != null) {
		data.createdAt = props.createdAt;
	}

	if (props.updatedAt != null) {
		data.updatedAt = props.updatedAt;
	}

	for (let field of ["body", "title", "description", "excerpt"] as const) {
		if (field === "body" || field === "title") {
			if (props[field] != null) {
				data[field] = props[field];
			}
		} else if (props[field] !== undefined) {
			data[field] = props[field];
		}
	}

	let blogPost = await prisma.blogPost.update({
		where: { id },
		data,
		include: { user: true },
	});
	return modelBlogPostWithSEO(blogPost);
}

export async function deleteBlogPost(id: string) {
	let post = await prisma.blogPost.delete({
		where: { id },
	});
	return modelBlogPost(post);
}

export function modelSEO(seo: DBBlogPost | Partial<SEO>): SEO {
	return {
		// metaTitle: seo.metaTitle,
		// metaDescription: seo.metaDescription,
		// metaImage: seo.metaImage,
		// robots: seo.robots,
		// canonical: seo.canonical,
		twitterCard: seo.twitterCard ?? null,
		twitterSite: seo.twitterSite ?? null,
		twitterCreator: seo.twitterCreator ?? null,
		// ogTitle: seo.ogTitle,
		// ogDescription: seo.ogDescription,
	};
}

export function modelBlogPost(blogPost: BlogPost | DBBlogPost): BlogPost {
	return {
		id: blogPost.id,
		title: blogPost.title,
		slug: blogPost.slug,
		description: blogPost.description || null,
		excerpt: blogPost.excerpt || null,
		body: blogPost.body,
		createdAt: blogPost.createdAt,
		updatedAt: blogPost.updatedAt,
		userId: blogPost.userId,
	};
}

export function modelBlogPostWithSEO(blogPost: DBBlogPost): BlogPostWithSEO;
export function modelBlogPostWithSEO(
	blogPost: BlogPost,
	seo: Partial<SEO> | null,
): BlogPostWithSEO;

export function modelBlogPostWithSEO(
	blogPost: DBBlogPost | BlogPost,
	seo?: Partial<SEO> | null,
): BlogPostWithSEO {
	return {
		...modelBlogPost(blogPost),
		seo: modelSEO(seo ?? (blogPost as DBBlogPost)),
	};
}

export type PostSelector<
	Post extends BlogPost,
	Selection extends ArrayOfKeys<Post> | null = null,
> =
	Selection extends ArrayOfKeys<Post>
		? Array<Pick<Post, Selection[number]>>
		: Array<Post>;
