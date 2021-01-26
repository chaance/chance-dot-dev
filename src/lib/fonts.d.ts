import * as React from "react";

// const ffSans = "Inter";
export const ffSans: "neue-haas-grotesk-display";
export const ffSerif: "skolar-latin";
export const ffMono: "ibm-plex-mono";
// const ffMono = "IBM Plex Mono";

// Map of font names to each font's corresponding stylesheet
export const webFonts: {
	[key in Font]: string;
};

export const fontLists: {
	sans: any[];
	serif: any[];
	mono: any[];
};

export const fonts: Fonts;

export const fontsInitialState: FontState;

export const FontContext: React.Context<FontState>;

export const FontProvider: React.FC;

export function useFonts(): FontState;

export interface FontState {
	fonts: Font[];
	loadingComplete: boolean;
	error?: any;
}

// export type Font = 'ivyjournal' | 'ivystyle-sans' | 'ibm-plex-mono';
export type Font = string;

export type Fonts = {
	[key in FontStyle]: Font;
};

export type FontStyle = "serif" | "sans" | "mono" | "title" | "titleSmall";

export default fonts;
