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

export interface Category {
	slug: string;
	label: string;
}

export interface NotesMdx {
	content: string;
	frontMatter: FrontMatter;
	filePath: string;
	linkPath: string;
}
