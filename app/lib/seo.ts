import { getSeoMeta } from "~/lib/remix-seo";
import type { SeoMetadata } from "~/lib/remix-seo";

export const DEFAULT_METADATA: SeoMetadata = {
	title: "chance.dev",
	siteName: "chance.dev",
	titleTemplate: "%t %s chance.dev",
	description:
		"Thoughts and experiences from a southeastern web dev in southern California",
	twitter: {
		site: "@chancethedev",
		creator: "@chancethedev",
		card: "summary_large_image",
		image: {
			alt: "Chance the Dev: Web developer. Open source maker. Southern fella on the west coast.",
			url: `https://chance.dev/images/root-twitter-card.jpg`,
		},
	},
};

export { getSeoMeta };
