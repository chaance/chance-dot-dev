import type { MetaDescriptor } from "react-router";
import uniqBy from "lodash/uniqBy";

// TODO: Provide a smart merge function. Figure out reasonable expectations on
// how to handle overrides here, needs to be smarter than just a deep merge. For
// example, if the user provides a `twitter` object, should we merge it with the
// default `twitter` object, or replace it? Images shouldn't be deep merged as
// height/width/alt are possibly different w/ overrides, but other object types
// should be merged.
//
// TODO: Add ld+json schema

export function getSeoMeta(metadata: SeoMetadata): MetaDescriptor[] {
	let meta: MetaDescriptor[] = [];
	let title = getSeoTitle(metadata);
	let {
		canonical,
		description,
		facebook,
		omitGoogleBotMeta = false,
		openGraph,
		robots,
		twitter,
		mobileAlternate,
		languageAlternates,
	} = metadata;

	if (title) {
		// meta.title = title;
		meta.push({ title });
	}

	if (description) {
		meta.push({ name: "description", content: description });
	}

	// Robots
	let {
		maxImagePreview,
		maxSnippet,
		maxVideoPreview,
		noArchive,
		noFollow,
		noImageIndex,
		noIndex,
		noSnippet,
		noTranslate,
		unavailableAfter,
	} = robots || {};

	let robotsParams = [
		noArchive && "noarchive",
		noImageIndex && "noimageindex",
		noSnippet && "nosnippet",
		noTranslate && `notranslate`,
		maxImagePreview && `max-image-preview:${maxImagePreview}`,
		maxSnippet && `max-snippet:${maxSnippet}`,
		maxVideoPreview && `max-video-preview:${maxVideoPreview}`,
		unavailableAfter && `unavailable_after:${unavailableAfter}`,
	];

	let robotsParam =
		(noIndex ? "noindex" : "index") + "," + (noFollow ? "nofollow" : "follow");

	for (let param of robotsParams) {
		if (param) {
			robotsParam += `,${param}`;
		}
	}

	meta.push({ name: "robots", content: robotsParam });
	if (!omitGoogleBotMeta) {
		meta.push({ name: "googlebot", content: robotsParam });
	}

	// OG: Twitter
	if (twitter) {
		if (twitter.title || title) {
			meta.push({ name: "twitter:title", content: twitter.title || title });
		}

		if (twitter.description || openGraph?.description || description) {
			meta.push({
				name: "twitter:description",
				content: twitter.description || openGraph?.description || description,
			});
		}

		let hasTwitterCard = false;
		if (twitter.card) {
			let cardType = validateTwitterCard(twitter);
			if (cardType) {
				hasTwitterCard = true;
				meta.push({ name: "twitter:card", content: cardType });
			}
		}

		if (twitter.site) {
			meta.push({
				name: "twitter:site",
				content:
					typeof twitter.site === "object" ? twitter.site.id : twitter.site,
			});
		}

		if (twitter.creator) {
			meta.push({
				name: "twitter:creator",
				content:
					typeof twitter.creator === "object"
						? twitter.creator.id
						: twitter.creator,
			});
		}

		if (hasTwitterImageMeta(twitter)) {
			warnIfInvalidUrl(
				twitter.image.url,
				`The twitter:image tag must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`twitter.image.url\` value.`
			);
			meta.push({ name: "twitter:image", content: twitter.image.url });
			if (twitter.image.alt) {
				meta.push({ name: "twitter:image:alt", content: twitter.image.alt });
			} else {
				warn(
					"A Twitter image should use alt text that describes the image. This is important for users who are visually impaired. Please add a text value to the `alt` key of the `twitter.image` config option to dismiss this warning."
				);
			}
		}

		if (hasTwitterPlayerMeta(twitter)) {
			if (twitter.player.url) {
				warnIfInvalidUrl(
					twitter.player.url,
					`The twitter:player tag must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`twitter.player.url\` value.`
				);
				meta.push({ name: "twitter:player", content: twitter.player.url });
			}

			if (twitter.player.stream) {
				warnIfInvalidUrl(
					twitter.player.stream,
					`The twitter:player:stream tag must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`twitter.player.stream\` value.`
				);
				meta.push({
					name: "twitter:player:stream",
					content: twitter.player.stream,
				});
			}

			if (isTruthyOrZero(twitter.player.height)) {
				meta.push({
					name: "twitter:player:height",
					content: twitter.player.height.toString(),
				});
			}

			if (isTruthyOrZero(twitter.player.width)) {
				meta.push({
					name: "twitter:player:width",
					content: twitter.player.width.toString(),
				});
			}
		}

		if (hasTwitterAppMeta(twitter)) {
			const twitterDevices = ["iPhone", "iPad", "googlePlay"] as const;

			if (typeof twitter.app.name === "object") {
				for (const device of twitterDevices) {
					if (twitter.app.name[device]) {
						meta.push({
							name: `twitter:app:name:${device.toLowerCase()}`,
							content: twitter.app.name[device],
						});
					}
				}
			} else {
				meta.push({
					name: "twitter:app:name:iphone",
					content: twitter.app.name,
				});
				meta.push({
					name: "twitter:app:name:ipad",
					content: twitter.app.name,
				});
				meta.push({
					name: "twitter:app:name:googleplay",
					content: twitter.app.name,
				});
			}

			if (typeof twitter.app.id === "object") {
				for (const device of twitterDevices) {
					if (twitter.app.id[device]) {
						meta.push({
							name: `twitter:app:id:${device.toLowerCase()}`,
							content: twitter.app.id[device],
						});
					}
				}
			}

			if (typeof twitter.app.url === "object") {
				for (const device of twitterDevices) {
					if (twitter.app.url[device]) {
						meta.push({
							name: `twitter:app:url:${device.toLowerCase()}`,
							content: twitter.app.url[device],
						});
					}
				}
			}
		}

		if (!hasTwitterCard) {
			if (hasTwitterPlayerMeta(twitter)) {
				meta.push({ name: "twitter:card", content: "player" });
			} else if (hasTwitterAppMeta(twitter)) {
				meta.push({ name: "twitter:card", content: "app" });
			} else if (hasTwitterImageMeta(twitter)) {
				meta.push({ name: "twitter:card", content: "summary" });
			}
		}
	}

	// OG: Facebook
	if (facebook) {
		if (facebook.appId) {
			meta.push({ property: "fb:app_id", content: facebook.appId });
		}
	}

	// OG: Other stuff
	if (openGraph?.title || metadata.title) {
		meta.push({
			property: "og:title",
			content: openGraph?.title || metadata.title,
		});
	}

	if (openGraph?.description || description) {
		meta.push({
			property: "og:description",
			content: openGraph?.description || description,
		});
	}

	if (canonical) {
		warnIfInvalidUrl(
			canonical,
			`The canonical link tag must have an \`href\` with a valid, absolute URL. Relative paths will not work as expected. Check the config's \`canonical\` value.`
		);
		meta.push({ tagName: "link", rel: "canonical", href: canonical });
	}

	let links: (MetaDescriptor & {
		tagName: "link";
		rel: string;
		href: string;
		hrefLang?: string;
		media?: string;
	})[] = [];
	// <link rel="alternate">
	if (mobileAlternate) {
		if (!mobileAlternate.media || !mobileAlternate.href) {
			warn(
				"`mobileAlternate` requires both the `media` and `href` attributes for it to generate the correct link tags. This config setting currently has no effect. Either add the missing keys or remove `mobileAlternate` from your config to dismiss this warning." +
					// TODO: See if we can find a better description of this tag w/o all
					// the marketing junk. MDN is a bit scant here.
					"\n\nSee https://www.contentkingapp.com/academy/link-rel/#mobile-lok for a description of the tag this option generates."
			);
		} else {
			links.push({
				tagName: "link",
				rel: "alternate",
				media: mobileAlternate.media,
				href: mobileAlternate.href,
			});
		}
	}

	if (languageAlternates && languageAlternates.length > 0) {
		for (let languageAlternate of languageAlternates) {
			if (!languageAlternate.hrefLang || !languageAlternate.href) {
				warn(
					"Items in `languageAlternates` requires both the `hrefLang` and `href` attributes for it to generate the correct link tags. One of your items in this config setting is missing an attribute and was skipped. Either add the missing keys or remove the incomplete object from the `languageAlternate` key in your config to dismiss this warning." +
						// TODO: See if we can find a better description of this tag w/o all
						// the marketing junk. MDN is a bit scant here.
						"\n\nSee https://www.contentkingapp.com/academy/link-rel/#hreflang-look-like for a description of the tag this option generates."
				);
			} else {
				links.push({
					tagName: "link",
					rel: "alternate",
					hrefLang: languageAlternate.hrefLang,
					href: languageAlternate.href,
				});
			}
		}
	}

	meta.push(
		...uniqBy(
			links,
			(val) => val.rel + val.href + (val.hrefLang || "") + (val.media || "")
		)
	);

	if (openGraph) {
		if (openGraph.url || canonical) {
			if (openGraph.url) {
				warnIfInvalidUrl(
					openGraph.url,
					`The og:url tag must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`openGraph.url\` value.`
				);
			}
			if (canonical) {
				warnIfInvalidUrl(
					canonical,
					`The og:url tag must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`canonical\` value.`
				);
			}

			// meta["og:url"] = openGraph.url || canonical!;
			meta.push({
				property: "og:url",
				content: openGraph.url || canonical,
			});
		}

		if (openGraph.type) {
			const ogType = openGraph.type.toLowerCase();

			meta.push({ property: "og:type", content: ogType });

			if (ogType === "profile" && openGraph.profile) {
				if (openGraph.profile.firstName) {
					meta.push({
						property: "profile:first_name",
						content: openGraph.profile.firstName,
					});
				}

				if (openGraph.profile.lastName) {
					meta.push({
						property: "profile:last_name",
						content: openGraph.profile.lastName,
					});
				}

				if (openGraph.profile.username) {
					meta.push({
						property: "profile:username",
						content: openGraph.profile.username,
					});
				}

				if (openGraph.profile.gender) {
					meta.push({
						property: "profile:gender",
						content: openGraph.profile.gender,
					});
				}
			} else if (ogType === "book" && openGraph.book) {
				if (openGraph.book.authors && openGraph.book.authors.length) {
					for (let author of openGraph.book.authors) {
						meta.push({ property: "book:author", content: author });
					}
				}

				if (openGraph.book.isbn) {
					meta.push({ property: "book:isbn", content: openGraph.book.isbn });
				}

				if (openGraph.book.releaseDate) {
					meta.push({
						property: "book:release_date",
						content: openGraph.book.releaseDate,
					});
				}

				if (openGraph.book.tags && openGraph.book.tags.length) {
					for (let tag of openGraph.book.tags) {
						meta.push({ property: "book:tag", content: tag });
					}
				}
			} else if (ogType === "article" && openGraph.article) {
				if (openGraph.article.publishedTime) {
					meta.push({
						property: "article:published_time",
						content: openGraph.article.publishedTime,
					});
				}

				if (openGraph.article.modifiedTime) {
					meta.push({
						property: "article:modified_time",
						content: openGraph.article.modifiedTime,
					});
				}

				if (openGraph.article.expirationTime) {
					meta.push({
						property: "article:expiration_time",
						content: openGraph.article.expirationTime,
					});
				}

				if (openGraph.article.authors && openGraph.article.authors.length) {
					for (let author of openGraph.article.authors) {
						meta.push({ property: "article:author", content: author });
					}
				}

				if (openGraph.article.section) {
					meta.push({
						property: "article:section",
						content: openGraph.article.section,
					});
				}

				if (openGraph.article.tags && openGraph.article.tags.length) {
					for (let tag of openGraph.article.tags) {
						meta.push({ property: "article:tag", content: tag });
					}
				}
			} else if (
				(ogType === "video.movie" ||
					ogType === "video.episode" ||
					ogType === "video.tv_show" ||
					ogType === "video.other") &&
				openGraph.video
			) {
				if (openGraph.video.actors && openGraph.video.actors.length) {
					for (let actor of openGraph.video.actors) {
						if (actor.profile) {
							meta.push({
								property: "video:actor",
								content: actor.profile,
							});
						}

						if (actor.role) {
							meta.push({
								property: "video:actor:role",
								content: actor.role,
							});
						}
					}
				}

				if (openGraph.video.directors && openGraph.video.directors.length) {
					for (let director of openGraph.video.directors) {
						meta.push({ property: "video:director", content: director });
					}
				}

				if (openGraph.video.writers && openGraph.video.writers.length) {
					for (let writer of openGraph.video.writers) {
						meta.push({ property: "video:writer", content: writer });
					}
				}

				if (isTruthyOrZero(openGraph.video.duration)) {
					meta.push({
						property: "video:duration",
						content: openGraph.video.duration.toString(),
					});
				}

				if (openGraph.video.releaseDate) {
					meta.push({
						property: "video:release_date",
						content: openGraph.video.releaseDate,
					});
				}

				if (openGraph.video.tags && openGraph.video.tags.length > 0) {
					for (let tag of openGraph.video.tags) {
						meta.push({ property: "video:tag", content: tag });
					}
				}

				if (openGraph.video.series) {
					meta.push({
						property: "video:series",
						content: openGraph.video.series,
					});
				}
			}
		}

		if (openGraph.images && openGraph.images.length) {
			for (let image of openGraph.images) {
				warnIfInvalidUrl(
					image.url,
					`The og:image tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`url\` value in the config's \`openGraph.images\` array.`
				);
				meta.push({ property: "og:image", content: image.url });
				if (image.alt) {
					meta.push({ property: "og:image:alt", content: image.alt });
				} else {
					warn(
						"OpenGraph images should use alt text that describes the image. This is important for users who are visually impaired. Please add a text value to the `alt` key of all `openGraph.images` config options to dismiss this warning."
					);
				}

				if (image.secureUrl) {
					warnIfInvalidUrl(
						image.secureUrl,
						`The og:image:secure_url tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`secureUrl\` value in the config's \`openGraph.images\` array.`
					);
					meta.push({
						property: "og:image:secure_url",
						content: image.secureUrl,
					});
				}

				if (image.type) {
					meta.push({ property: "og:image:type", content: image.type });
				}

				if (isTruthyOrZero(image.width)) {
					meta.push({
						property: "og:image:width",
						content: image.width.toString(),
					});
				}

				if (isTruthyOrZero(image.height)) {
					meta.push({
						property: "og:image:height",
						content: image.height.toString(),
					});
				}
			}
		}

		if (openGraph.videos && openGraph.videos.length) {
			for (let video of openGraph.videos) {
				warnIfInvalidUrl(
					video.url,
					`The og:video tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`url\` value in the config's \`openGraph.videos\` array.`
				);
				meta.push({ property: "og:video", content: video.url });
				if (video.alt) {
					meta.push({ property: "og:video:alt", content: video.alt });
				}

				if (video.secureUrl) {
					warnIfInvalidUrl(
						video.secureUrl,
						`The og:video:secure_url tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`secureUrl\` value in the config's \`openGraph.videos\` array.`
					);
					meta.push({
						property: "og:video:secure_url",
						content: video.secureUrl,
					});
				}

				if (video.type) {
					meta.push({ property: "og:video:type", content: video.type });
				}

				if (isTruthyOrZero(video.width)) {
					meta.push({
						property: "og:video:width",
						content: video.width.toString(),
					});
				}

				if (isTruthyOrZero(video.height)) {
					meta.push({
						property: "og:video:height",
						content: video.height.toString(),
					});
				}
			}
		}

		if (openGraph.locale) {
			meta.push({ property: "og:locale", content: openGraph.locale });
		}

		if (openGraph.siteName) {
			meta.push({ property: "og:site_name", content: openGraph.siteName });
		}
	}

	return meta;
}

function getSeoTitle(metadata: SeoMetadata): string {
	let bypassTitleTemplate = metadata.bypassTitleTemplate || false;
	let templateTitle = metadata.titleTemplate || "";
	let titleSeparator = metadata.titleSeparator || "|";
	let updatedTitle = "";
	let pageTitle = metadata.title || metadata.defaultTitle;
	if (pageTitle) {
		updatedTitle = pageTitle;
		if (templateTitle && !bypassTitleTemplate) {
			let titleParts = templateTitle
				.replace(/%t/g, updatedTitle)
				.split("%s")
				.map((i) => i.trim());

			// Remove duplicate parts. Users may want the page name to be the same as
			// the site name on the homepage, and there's no need to assume duplicates
			titleParts = [...new Set(titleParts)];

			updatedTitle = titleParts.join(` ${titleSeparator} `);
		}
	}
	return updatedTitle;
}

function warn(message: string): void {
	if (typeof console !== "undefined") console.warn("remix-seo: " + message);
	try {
		// This error is thrown as a convenience so you can more easily
		// find the source for a warning that appears in the console by
		// enabling "pause on exceptions" in your JavaScript debugger.
		throw new Error("remix-seo: " + message);
	} catch (e) {}
}

function warnIfInvalidUrl(str: string, message: string) {
	try {
		new URL(str);
	} catch (_) {
		if (typeof console !== "undefined") warn(message);
	}
}

function validateTwitterCard(
	twitter: TwitterMeta
): TwitterCardType | undefined {
	if (!twitter.card) {
		return;
	}

	if (
		!["app", "player", "summary", "summary_large_image"].includes(twitter.card)
	) {
		warn(`An invalid Twitter card was provided to the config and will be ignored. Make sure that \`twitter.card\` is set to one of the following:
- "app"
- "player"
- "summary"
- "summary_large_image"
Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
		return;
	}

	if (hasTwitterAppMeta(twitter)) {
		if (twitter.card !== "app") {
			warn(`An Twitter card type of \`${twitter.card}\` was provided to a config with app metadata. Twitter app cards must use a \`twitter:card\` value of \`"app"\`, so the app metadata will be ignored. Fix the \`twitter.card\` value or remove the \`twitter.app\` config to dismiss this warning.
Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
			// @ts-ignore
			delete twitter.app;
		} else {
			if (hasTwitterImageMeta(twitter)) {
				warn(`The Twitter app card type does not support the twitter:image metadata provided in your config. Remove the \`twitter.image\` config to dismiss this warning.
	Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
				// @ts-ignore
				delete twitter.image;
			}

			if (hasTwitterPlayerMeta(twitter)) {
				warn(`The Twitter app card type does not support the twitter:player metadata provided in your config. Remove the \`twitter.player\` config to dismiss this warning.
	Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
				// @ts-ignore
				delete twitter.player;
			}

			return "app";
		}
	}

	if (hasTwitterPlayerMeta(twitter)) {
		if (twitter.card !== "player") {
			warn(`An Twitter card type of \`${twitter.card}\` was provided to a config with player metadata. Twitter player cards must use a \`twitter:card\` value of \`"player"\`, so the player metadata will be ignored. Fix the \`twitter.card\` value or remove the \`twitter.player\` config to dismiss this warning.
Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
			// @ts-ignore
			delete twitter.player;
		} else {
			return "player";
		}
	}

	if (
		hasTwitterImageMeta(twitter) &&
		!["summary", "summary_large_image", "player"].includes(twitter.card)
	) {
		if (twitter.card !== "player") {
			warn(`An Twitter card type of \`${twitter.card}\` was provided to a config with image metadata. Cards that support image metadata are:
- "summary"
- "summary_large_image"
- "player"
The image metadata will be ignored. Fix the \`twitter.card\` value or remove the \`twitter.image\` config to dismiss this warning.
Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
			// @ts-ignore
			delete twitter.image;
		}
	}

	return twitter.card as TwitterCardType;
}

function hasTwitterAppMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
	app: { name: Required<TwitterAppMeta["name"]> } & TwitterAppMeta;
} {
	return !!(twitter.app && twitter.app.name);
}

function hasTwitterPlayerMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
	player: TwitterPlayerMeta;
} {
	return !!(twitter.player && (twitter.player.url || twitter.player.stream));
}

function hasTwitterImageMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
	image: { url: Required<TwitterImageMeta["url"]> } & TwitterImageMeta;
} {
	return !!(twitter.image && twitter.image.url);
}

function isTruthyOrZero<T>(
	value: T
): value is Exclude<T, "" | false | null | undefined> {
	return !!value || value === 0;
}

interface FacebookMeta {
	appId?: string | Nullish;
}

interface LanguageAlternate {
	hrefLang: string;
	href: string;
}

interface MobileAlternate {
	media: string;
	href: string;
}

interface OpenGraphArticle {
	authors?: string[];
	expirationTime?: string;
	modifiedTime?: string;
	publishedTime?: string;
	section?: string;
	tags?: string[];
}

interface OpenGraphBook {
	authors?: string[];
	isbn?: string;
	releaseDate?: string;
	tags?: string[];
}

interface OpenGraphMedia {
	alt: string;
	height?: number;
	secureUrl?: string;
	type?: string;
	url: string;
	width?: number;
}

interface OpenGraphMeta {
	article?: OpenGraphArticle;
	book?: OpenGraphBook;
	defaultImageHeight?: number;
	defaultImageWidth?: number;
	description?: string;
	images?: OpenGraphMedia[];
	locale?: string;
	profile?: OpenGraphProfile;
	siteName?: string;
	title?: string;
	type?: string;
	url?: string;
	video?: OpenGraphVideo;
	videos?: OpenGraphMedia[];
}

interface OpenGraphProfile {
	firstName?: string;
	lastName?: string;
	gender?: string;
	username?: string;
}

interface OpenGraphVideo {
	actors?: OpenGraphVideoActors[];
	directors?: string[];
	duration?: number;
	releaseDate?: string;
	series?: string;
	tags?: string[];
	writers?: string[];
}

interface OpenGraphVideoActors {
	profile: string;
	role?: string;
}

/**
 * @see https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
 */
interface RobotsOptions {
	/**
	 * Set the maximum size of an image preview for this page in a search results.
	 *
	 * If false, Google may show an image preview of the default size.
	 *
	 * Accepted values are:
	 *
	 * - **none:** No image preview is to be shown.
	 * - **standard:** A default image preview may be shown.
	 * - **large:** A larger image preview, up to the width of the viewport, may
	 *   be shown.
	 *
	 * This applies to all forms of search results (such as Google web search,
	 * Google Images, Discover, Assistant). However, this limit does not apply in
	 * cases where a publisher has separately granted permission for use of
	 * content. For instance, if the publisher supplies content in the form of
	 * in-page structured data (such as AMP and canonical versions of an article)
	 * or has a license agreement with Google, this setting will not interrupt
	 * those more specific permitted uses.
	 *
	 * If you don't want Google to use larger thumbnail images when their AMP
	 * pages and canonical version of an article are shown in Search or Discover,
	 * provide a value of `"standard"` or `"none"`.
	 */
	maxImagePreview?: "none" | "standard" | "large" | Nullish;
	/**
	 * The maximum of number characters to use as a textual snippet for a search
	 * result. (Note that a URL may appear as multiple search results within a
	 * search results page.)
	 *
	 * This does **not** affect image or video previews. This applies to all forms
	 * of search results (such as Google web search, Google Images, Discover,
	 * Assistant). However, this limit does not apply in cases where a publisher
	 * has separately granted permission for use of content. For instance, if the
	 * publisher supplies content in the form of in-page structured data or has a
	 * license agreement with Google, this setting does not interrupt those more
	 * specific permitted uses. This directive is ignored if no parseable value is
	 * specified.
	 *
	 * Special values:
	 * - 0: No snippet is to be shown. Equivalent to nosnippet.
	 * - 1: Google will choose the snippet length that it believes is most
	 *   effective to help users discover your content and direct users to your
	 *   site.
	 *
	 * To specify that there's no limit on the number of characters that can be
	 * shown in the snippet, `maxSnippet` should be set to `-1`.
	 */
	maxSnippet?: number | Nullish;
	/**
	 * The maximum number of seconds for videos on this page to show in search
	 * results.
	 *
	 * If false, Google may show a video snippet in search results and will decide
	 * how long the preview may be.
	 *
	 * Special values:
	 *
	 * - 0: At most, a static image may be used, in accordance to the
	 *   `maxImagePreview` setting.
	 * - 1: There is no limit.
	 *
	 * This applies to all forms of search results (at Google: web search, Google
	 * Images, Google Videos, Discover, Assistant).
	 */
	maxVideoPreview?: number | Nullish;
	/**
	 * Do not show a cached link in search results.
	 *
	 * If false, Google may generate a cached page and users may access it through
	 * the search results.
	 */
	noArchive?: boolean | Nullish;
	/**
	 * Do not follow the links on this page.
	 *
	 * If false, Google may use the links on the page to discover those linked
	 * pages.
	 *
	 * @see https://developers.google.com/search/docs/advanced/guidelines/qualify-outbound-links
	 */
	noFollow?: boolean | Nullish;
	/**
	 * Do not index images on this page.
	 *
	 * If false, images on the page may be indexed and shown in search results.
	 */
	noImageIndex?: boolean | Nullish;
	/**
	 * Do not show this page, media, or resource in search results.
	 *
	 * If false, the page, media, or resource may be indexed and shown in search
	 * results.
	 */
	noIndex?: boolean | Nullish;
	/**
	 * Do not show a text snippet or video preview in the search results for this
	 * page. A static image thumbnail (if available) may still be visible, when it
	 * results in a better user experience. This applies to all forms of search
	 * results (at Google: web search, Google Images, Discover).
	 *
	 * If false, Google may generate a text snippet and video preview based on
	 * information found on the page.
	 */
	noSnippet?: boolean | Nullish;
	/**
	 * Do not offer translation of this page in search results.
	 *
	 * If false, Google may show a link next to the result to help users view
	 * translated content on your page.
	 */
	noTranslate?: boolean | Nullish;
	/**
	 * Do not show this page in search results after the specified date/time.
	 *
	 * The date/time must be specified in a widely adopted format including, but
	 * not limited to [RFC 822](http://www.ietf.org/rfc/rfc0822.txt), [RFC
	 * 850](http://www.ietf.org/rfc/rfc0850.txt), and [ISO
	 * 8601](https://www.iso.org/iso-8601-date-and-time-format.html). The
	 * directive is ignored if no valid date/time is specified.
	 *
	 * By default there is no expiration date for content.
	 */
	unavailableAfter?: string | Nullish;
}

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 */
interface TwitterMeta {
	/**
	 * The card type. Used with all cards.
	 */
	card?: TwitterCardType | Nullish;
	/**
	 * The @username of content creator, which may be different than the @username
	 * of the site itself. Used with `summary_large_image` cards.
	 */
	creator?: string | { id: string } | Nullish;
	/**
	 * Description of content (maximum 200 characters). Used with `summary`,
	 * `summary_large_image`, and `player` cards.
	 */
	description?: string | Nullish;
	/**
	 * The @username of the website. Used with `summary`, `summary_large_image`,
	 * `app`, and `player` cards
	 */
	site?: string | { id: string } | Nullish;
	/**
	 * Title of content (max 70 characters). Used with `summary`, `summary_large_image`, and `player` cards
	 */
	title?: string | Nullish;
	/**
	 * The image to use in the card. Images must be less than 5MB in size. JPG,
	 * PNG, WEBP and GIF formats are supported. Only the first frame of an
	 * animated GIF will be used. SVG is not supported. Used with `summary`,
	 * `summary_large_image`, and `player` cards.
	 */
	image?: TwitterImageMeta | Nullish;
	/**
	 * The video player to use in the card. Used with the `player` card.
	 */
	player?: TwitterPlayerMeta | Nullish;
	/**
	 * Meta used with the `app` card.
	 */
	app?: TwitterAppMeta | Nullish;
}

type TwitterCardType = "app" | "player" | "summary" | "summary_large_image";

interface TwitterImageMeta {
	/**
	 * The URL of the image to use in the card. This must be an absolute URL,
	 * *not* a relative path.
	 */
	url: string;
	/**
	 * A text description of the image conveying the essential nature of an image
	 * to users who are visually impaired. Maximum 420 characters.
	 */
	alt: string;
}

interface TwitterPlayerMeta {
	/**
	 * The URL to the player iframe. This must be an absolute URL, *not* a
	 * relative path.
	 */
	url: string;
	/**
	 * The URL to raw video or audio stream. This must be an absolute URL, *not* a
	 * relative path.
	 */
	stream?: string | Nullish;
	/**
	 * Height of the player iframe in pixels.
	 */
	height?: number | Nullish;
	/**
	 * Width of the player iframe in pixels.
	 */
	width?: number | Nullish;
}

interface TwitterAppMeta {
	name: string | { iPhone?: string; iPad?: string; googlePlay?: string };
	id: { iPhone?: string; iPad?: string; googlePlay?: string };
	url: { iPhone?: string; iPad?: string; googlePlay?: string };
}

export interface SeoMetadata {
	bypassTitleTemplate?: boolean | Nullish;
	canonical?: string | Nullish;
	defaultTitle?: string | Nullish;
	description?: string | Nullish;
	facebook?: FacebookMeta | Nullish;
	languageAlternates?: LanguageAlternate[] | Nullish;
	mobileAlternate?: MobileAlternate | Nullish;
	omitGoogleBotMeta?: boolean | Nullish;
	openGraph?: OpenGraphMeta | Nullish;
	robots?: RobotsOptions | Nullish;
	siteName?: string | Nullish;
	title?: string | Nullish;
	titleSeparator?: string | Nullish;
	titleTemplate?: string | Nullish;
	twitter?: TwitterMeta | Nullish;
}

type Nullish = null | undefined;
