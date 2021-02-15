export interface FrontMatter {
	slug?: string;
	subtitle?: string;
	date?: string;
	formattedDate?: string;
	title?: string;
	description?: string;
	langs?: string[];
	categories?: Category[];
	keywords?: string[];
	banner?: string;
	bannerAlt?: string;
	published?: boolean;
	author?: string;
}

export interface PublishedFrontmatter extends FrontMatter {
	title: string;
	published: true;
}

export interface Category {
	slug: string;
	label: string;
}

export interface NoteMdx {
	content: string;
	frontMatter: FrontMatter;
	filePath: string;
	linkPath: string;
}

export interface PublishedNoteMdx extends NoteMdx {
	frontMatter: PublishedFrontmatter;
}
