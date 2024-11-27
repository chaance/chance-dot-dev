import type { LoaderFunctionArgs } from "react-router";
import { json } from "~/lib/utils";
import { getMetaImageUrl } from "~/features/meta-images.server";

const VALID_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);

export async function loader({ request }: LoaderFunctionArgs) {
	let requestUrl = new URL(request.url);
	let searchParams = new URLSearchParams(requestUrl.search);
	let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

	let slug = searchParams.get("slug");
	let title = searchParams.get("title");
	let authorName = searchParams.get("authorName");
	let authorTitle = searchParams.get("authorTitle");
	let displayDate = searchParams.get("date");

	if (!slug || !title || !displayDate) {
		throw json({ error: "Missing required params" }, 400);
	}

	let socialImageUrl = await getMetaImageUrl({
		slug,
		siteUrl,
		title,
		authorName,
		authorTitle,
		displayDate,
	});

	try {
		let contentType = await getImageContentType(socialImageUrl);
		if (!contentType) {
			throw json({ error: "Invalid image" }, 400);
		}
		let resp = await fetch(socialImageUrl, {
			headers: {
				"Content-Type": contentType,
			},
		});
		if (resp.status >= 300) {
			throw resp;
		}
		return resp;
	} catch (err) {
		if (import.meta.env.DEV) {
			throw err;
		} else {
			throw Error(
				"Error fetching the social image; this is likely an error in the img/meta route loader",
			);
		}
	}
}

async function getImageContentType(url: URL) {
	try {
		let pathname = url.pathname;
		let extention = pathname.split(".").pop()?.toLowerCase();
		if (!extention || !VALID_IMAGE_EXTENSIONS.has(extention)) {
			return null;
		}
		return `image/${extention}`;
	} catch {
		return null;
	}
}
