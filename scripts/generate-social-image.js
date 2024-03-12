import path from "node:path";
import getEmojiRegex from "emoji-regex";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_FOLDER_NAME) {
	throw new Error("Missing CLOUDINARY_CLOUD_NAME or CLOUDINARY_FOLDER_NAME");
}

const argv = await yargs(process.argv.slice(2))
	.options({
		title: { type: "string", demandOption: true },
		slug: { type: "string" },
		authorName: { type: "string" },
		authorTitle: { type: "string" },
		siteUrl: { type: "string", default: "https://chance.dev" },
		date: {
			type: "string",
			default: new Date().toLocaleString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "America/Los_Angeles",
			}),
		},
	})
	.parse();

let title = argv.title;
let slug = argv.slug || kebabCase(title);
let siteUrl = argv.siteUrl;
let authorName = argv.authorName;
let authorTitle = argv.authorTitle;
let displayDate = argv.date;

console.log(
	"----------------------\n" +
		(await getSocialImageUrl({
			slug,
			siteUrl,
			title,
			displayDate,
			authorName,
			authorTitle,
		})),
);

/** @param {string} string */
function stripEmojis(string) {
	return string.replace(getEmojiRegex(), "").replace(/\s+/g, " ").trim();
}

/**
 * Cloudinary needs double-encoding
 * @param {string} string
 */
function doubleEncode(string) {
	return encodeURIComponent(encodeURIComponent(string));
}

/**
 * Cloudinary needs double-encoding
 * @param {SocialImageArgs} args
 */
function getCloudinarySocialImageUrl({
	title,
	displayDate,
	authorName,
	authorTitle,
}) {
	// Important: no leading hash for hex values
	let primaryTextColor = "ffffff";
	let secondaryTextColor = "d0d0d0";

	// Custom font files — must be uploaded to cloudinary in the same folder as
	// all of the images
	let primaryFont = "untitled-sans-regular.woff2";
	let titleFont = "editorial-new.woff2";

	let vars = [
		"$th_1256", // image height in pixels
		"$tw_2400", // image width in pixels
		"$gh_$th_div_12", // image height / 12
		"$gw_$tw_div_24", // image width / 24
	].join(",");

	let templateImage = `${CLOUDINARY_FOLDER_NAME}/social-background.png`;
	let templateImageTransform = [
		"c_fill", // fit rule
		"w_$tw", // width
		"h_$th", // height
	].join(",");

	let encodedDate = doubleEncode(stripEmojis(displayDate));
	let dateTransform = [
		`co_rgb:${secondaryTextColor}`, // text color
		"c_fit", // fit rule
		"g_north_west", // text box position
		"w_$gw_mul_14", // text box width ($gw * 14)
		"h_$gh", // text box height
		"x_$gw_mul_1.5", // text box x position ($gw * 1.5)
		"y_$gh_mul_1.8", // text box y position ($gh * 1.5)
		`l_text:${CLOUDINARY_FOLDER_NAME}:${primaryFont}_50_bold:${encodedDate}`, // textbox:font:content
	].join(",");

	let encodedTitle = doubleEncode(stripEmojis(title));
	let titleTransform = [
		`co_rgb:${primaryTextColor}`, // text color
		"c_fit", // fit rule
		"g_north_west", // text box position
		"w_$gw_mul_18", // text box width ($gw * 20.5)
		"h_$gh_mul_7", // text box height ($gh * 7)
		"x_$gw_mul_1.5", // text box x position ($gw * 1.5)
		"y_$gh_mul_2.6", // text box y position ($gh * 2.3)
		`l_text:${CLOUDINARY_FOLDER_NAME}:${titleFont}_180_line_spacing_-24:${encodedTitle}`, // textbox:font:content
	].join(",");

	let authorNameTransform;
	if (authorName) {
		let encodedAuthorName = doubleEncode(stripEmojis(authorName));
		// let authorNameSlug = slugify(stripEmojis(authorName));
		authorNameTransform = [
			`co_rgb:${primaryTextColor}`, // text color
			`c_fit`, // fit rule
			`g_north_west`, // text box position
			`w_$gw_mul_8.5`, // text box width ($gw * 5.5)
			`h_$gh_mul_4`, // text box height ($gh * 4)
			`x_$gw_mul_1.5`, // text box x position ($gw * 1.5)
			`y_$gh_mul_9.3`, // text box y position ($gh * 9)
			`l_text:${CLOUDINARY_FOLDER_NAME}:${primaryFont}_78:${encodedAuthorName}`, // textbox:font:content
		].join(",");
	}

	let authorTitleTransform;
	if (authorTitle) {
		let encodedAuthorTitle = doubleEncode(stripEmojis(authorTitle));
		authorTitleTransform = [
			`co_rgb:${secondaryTextColor}`, // text color
			`c_fit`, // fit rule
			`g_north_west`, // text box position
			`w_$gw_mul_9`, // text box width ($gw * 9)
			`x_$gw_mul_1.5`, // text box x position ($gw * 1.5)
			`y_$gh_mul_10.2`, // text box y position ($gh * 9.8)
			`l_text:${CLOUDINARY_FOLDER_NAME}:${primaryFont}_40:${encodedAuthorTitle}`, // textbox:font:content
		].join(",");
	}

	// let authorImageTransform = [
	// 	"c_fit", // fit rule
	// 	"g_north_west", // image position
	// 	`r_max`, // image radius
	// 	"w_$gw_mul_4", // image width ($gw * 4)
	// 	"h_$gh_mul_3", // image height ($gh * 3)
	// 	"x_$gw", // image x position ($gw)
	// 	"y_$gh_mul_8", // image y position ($gh * 8)
	// 	`l_${CLOUDINARY_FOLDER_NAME}:profile-${authorNameSlug}.jpg`, // image filename
	// ].join(",");

	return [
		`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`,
		vars,
		templateImageTransform,
		dateTransform,
		titleTransform,
		// authorImageTransform,
		authorNameTransform,
		authorTitleTransform,
		templateImage,
	]
		.filter(Boolean)
		.join("/");
}

/**
 * @param {{ slug: string; siteUrl: string } & SocialImageArgs} args
 */
export async function getSocialImageUrl({ slug, siteUrl, ...socialImageArgs }) {
	// let basePath = `blog-images/social/${slug}.jpg`;
	// let filePath = path.join(__dirname, "..", "public", basePath);
	// if (await fileExists(filePath)) {
	// 	return `${siteUrl}/${basePath}`;
	// }
	return getCloudinarySocialImageUrl(socialImageArgs);
}

/** @param {string} imagePath */
export async function getImageContentType(imagePath) {
	let ext = path.extname(imagePath).toLowerCase();
	if (!ext) return null;
	return `image/${ext.slice(1)}`;
}

/**
 * @typedef {{
 *  title: string;
 *  displayDate: string;
 *  authorName?: string;
 *  authorTitle?: string;
 * }} SocialImageArgs
 */

// async function fileExists(filePath: string) {
// 	try {
// 		let stat = await fsp.stat(filePath);
// 		return stat.isFile();
// 	} catch (_) {
// 		return false;
// 	}
// }

/** @param {string} string */
function kebabCase(string) {
	return string
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}
