import fsp from "fs/promises";
import { redirect } from "react-router";

export async function isDirectory(path: string) {
	try {
		return (await fsp.stat(path)).isDirectory();
	} catch (_) {
		return false;
	}
}

export async function readableFileExists(filePath: string) {
	try {
		let openned = await fsp.open(filePath, "r");
		openned.close();
		return true;
	} catch (_) {
		return false;
	}
}

/**
 * This should be used any time the redirect path is user-provided (Like the
 * query string on our login/signup pages). This avoids open-redirect
 * vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe. This
 * should always get a static value (never trust user input).
 */
export function getSafeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = "/",
) {
	if (!to || typeof to !== "string") {
		return defaultRedirect;
	}

	if (!to.startsWith("/") || to.startsWith("//")) {
		return defaultRedirect;
	}

	return to;
}

/**
 *
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe. This
 * should always get a static value (never trust user input).
 * @returns
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = "/",
	init?: number | ResponseInit,
) {
	return redirect(getSafeRedirect(to, defaultRedirect), init);
}
