// Strategy and code adapted from
// https://unpkg.com/browse/@kentcdodds/md-temp@3.2.1/dist/index.js
// See https://kentcdodds.com/blog/fixing-a-memory-leak-in-a-production-node-js-app
//
// This is intended to work around a memory leak in shiki so that the site
// doesn't crash when it hits memory limits
import fs from "node:fs/promises";
import { getHighlighter } from "shiki";

const base16Theme = JSON.parse(
	await fs.readFile(
		new URL("../data/shiki-base16.json", import.meta.url),
		"utf-8",
	),
);

/**
 * @param {{ code: string; language: string }} args
 */
async function getThemedTokens({ code, language }) {
	const themeName = base16Theme.name;
	const highlighter = await getHighlighter({
		langs: [language],
		themes: [base16Theme],
	});

	const theme = highlighter.getTheme(themeName);
	const tokens = highlighter.codeToTokensWithThemes(code, {
		// @ts-expect-error
		lang: language,
		themes: { dark: themeName, light: themeName },
	});
	return {
		fgColor: convertFakeHexToCustomProp(theme.fg || ""),
		bgColor: convertFakeHexToCustomProp(theme.bg || ""),
		tokens: tokens.map((lineTokens) =>
			lineTokens.map((t) => ({
				content: t.content,
				color: convertFakeHexToCustomProp(t.variants.light.color || ""),
			})),
		),
	};
}

export default getThemedTokens;

/**
 * The theme actually stores #FFFF${base-16-color-id} because vscode-textmate
 * requires colors to be valid hex codes, if they aren't, it changes them to a
 * default, so this is a mega hack to trick it.
 *
 * @param {string} color
 */
function convertFakeHexToCustomProp(color) {
	return color.replace(/^#FFFF(.+)/, "var(--base$1)");
}
