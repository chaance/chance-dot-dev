import React, { createContext } from "react";
import FontFaceObserver from "fontfaceobserver";
// import kebabCase from "lodash/kebabCase";
import { usePromise } from "@chance/hooks";
import { canUseDOM } from "src/lib/utils";

const googleStylesheet =
	"https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400;1,500&family=Nunito:ital,wght@0,400;0,700;1,400;1,700&display=swap";
const localStylesheet = "/fonts/style.css";

// const ffSans = "Inter";
const ffSans = "Nunito";
const ffSansCaps = "brandon-grotesque";
const ffSerif = "cooper";
const ffMono = "IBM Plex Mono";
// const ffMono = "IBM Plex Mono";

const __DEV__ = process.env.NODE_ENV === "development";

// Map of font names to each font's corresponding stylesheet
const webFonts: Record<string, string> = {
	[ffSans]: googleStylesheet,
	[ffSansCaps]: localStylesheet,
	[ffSerif]: localStylesheet,
	[ffMono]: googleStylesheet,
};

const SANS_SERIF_FALLBACKS = [
	"-apple-system",
	"BlinkMacSystemFont",
	'"Helvetica Neue"',
	"helvetica",
	"arial",
	"sans-serif",
];

const MONO_FALLBACKS = ['"Consolas"', '"Menlo"', '"Monaco"', "monospace"];

const fontLists: Record<FontType, string[]> = {
	sans: [quoteString(ffSans), ...SANS_SERIF_FALLBACKS],
	sansCaps: [quoteString(ffSansCaps), ...SANS_SERIF_FALLBACKS],
	serif: [quoteString(ffSerif), ...SANS_SERIF_FALLBACKS],
	mono: [quoteString(ffMono), ...MONO_FALLBACKS],
};

const fonts: Record<string, string> = Object.entries(fontLists)
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
		//const fontName = kebabCase(key);
		const fontName = key;
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

const fontsInitialState: FontContextValue = {
	fonts: [],
	loadingComplete: false,
	error: undefined,
};

const FontContext = createContext<FontContextValue>(fontsInitialState);

const FontProvider: React.FC = ({ children }) => {
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

const useFonts = () => {
	return React.useContext(FontContext);
};

function quoteString(str: string): string {
	return `"${str}"`;
}

type FontType = "sans" | "sansCaps" | "serif" | "mono";

interface FontContextValue {
	fonts: string[];
	loadingComplete: boolean;
	error: any;
}

export {
	ffMono,
	ffSans,
	ffSansCaps,
	ffSerif,
	fontLists,
	FontProvider,
	fonts,
	useFonts,
	webFonts,
};
