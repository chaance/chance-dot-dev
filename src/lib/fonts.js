import React, { createContext } from "react";
import FontFaceObserver from "fontfaceobserver";
import kebabCase from "lodash/kebabCase";
import { usePromise } from "@chancestrickland/hooks";
import { canUseDOM } from "$lib/utils";

const adobeStylesheet = `https://use.typekit.net/isw6kyj.css`;

// const ffSans = "Inter";
const ffSans = "neue-haas-grotesk-display";
const ffSerif = "skolar-latin";
const ffMono = "ibm-plex-mono";
// const ffMono = "IBM Plex Mono";

export { ffSans, ffSerif, ffMono };

const __DEV__ = process.env.NODE_ENV === "development";

// Map of font names to each font's corresponding stylesheet
export const webFonts = {
	[ffSans]: adobeStylesheet,
	[ffSerif]: adobeStylesheet,
	[ffMono]: adobeStylesheet,
};

export const fontLists = {
	sans: [quoteString(ffSans), "helvetica", "arial", "sans-serif"],
	serif: [quoteString(ffSerif), "times", "serif"],
	mono: [
		quoteString(ffMono),
		'"Consolas"',
		'"Menlo"',
		'"Monaco"',
		'"Andale Mono"',
		'"Ubuntu Mono"',
		"monospace",
	],
};

export const fonts = Object.entries(fontLists)
	.map(([key, family]) => [key, family.join(", ")])
	.reduce(
		(prev, [key, family]) => ({
			...prev,
			[key]: family,
		}),
		{}
	);

async function loadFonts() {
	let returnIfFailOrBail = {
		loaded: false,
		fonts: Object.keys(webFonts),
	};

	// For SSR, bail
	if (!canUseDOM()) {
		return returnIfFailOrBail;
	}

	const _fonts = Object.keys(webFonts).map(async (key) => {
		const font = new FontFaceObserver(key);
		const fontName = kebabCase(key);
		try {
			await font.load();
			return { font: fontName, loaded: true };
		} catch (errors) {
			return { font: fontName, loaded: false };
		}
	});
	try {
		const fontStatuses = await Promise.all(_fonts);
		if (fontStatuses.some(({ loaded }) => loaded === false)) {
			if (__DEV__) {
				console.error(
					"There was an error loading some web fonts. Reverting to fallbacks."
				);
			}
			return returnIfFailOrBail;
		}
		return {
			loaded: true,
			fonts: fontStatuses.map(({ font }) => font),
		};
	} catch (err) {
		if (__DEV__) {
			console.error(err);
		}
		return returnIfFailOrBail;
	}
}

export const fontsInitialState = {
	fonts: [],
	loadingComplete: false,
	error: undefined,
};

export const FontContext = createContext(fontsInitialState);

export const FontProvider = ({ children }) => {
	const [response, , error] = usePromise(loadFonts);
	const {
		loaded: loadingComplete = fontsInitialState.loadingComplete,
		fonts: _fonts = fontsInitialState.fonts,
	} = response || {};
	return (
		<FontContext.Provider value={{ loadingComplete, fonts: _fonts, error }}>
			{children}
		</FontContext.Provider>
	);
};

export const useFonts = () => {
	return React.useContext(FontContext);
};

/**
 * @param {string} str
 */
function quoteString(str) {
	return `"${str}"`;
}
