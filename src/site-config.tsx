import { NextSeoProps } from "next-seo";

const TWITTER_USER_NAME = "chancethedev";
const TWITTER_HANDLE = "@" + TWITTER_USER_NAME;
const SITE_TITLE = "chance.dev";
const SITE_DESC = "Musings on things that interest me";
const SITE_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://chance.dev";

export const authors: Author[] = [
	{
		id: "chance",
		name: "Chance Strickland",
		email: "hi@chancedigital.io",
		bio: `A programmer who occasionally podcasts.`,
		image: "images/chance.jpg",
	},
];

const config: Config = {
	pathPrefix: "/",
	siteTitle: SITE_TITLE,
	siteUrl: SITE_URL,

	// SEO
	seo: {
		title: SITE_TITLE,
		titleTemplate: "%s | chance.dev",
		description: SITE_DESC,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: SITE_URL,
			site_name: SITE_TITLE,
			images: [
				{
					url:
						"https://res.cloudinary.com/chancedigital/image/upload/v1612287816/cs.run/og-image.jpg",
					alt: "Welcome to chance.dev!",
					width: 1200,
					height: 630,
				},
				// {
				// 	url: 'https://www.example.ie/og-image.jpg',
				// 	width: 800,
				// 	height: 600,
				// 	alt: 'Og Image Alt',
				// },
				// {
				// 	url: 'https://www.example.ie/og-image-2.jpg',
				// 	width: 800,
				// 	height: 600,
				// 	alt: 'Og Image Alt 2',
				// },
			],
		},
		twitter: {
			handle: TWITTER_HANDLE,
			site: TWITTER_HANDLE,
			cardType: "summary_large_image",
		},
	},
};

type Config = {
	pathPrefix: string;
	siteTitle: string;
	siteUrl: string;
	seo: NextSeoProps;
};

export { config };
export default config;

interface Author {
	name: string;
	image: string;
	id: string;
	email: string;
	bio?: string;
}
