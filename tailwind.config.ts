import type { Config, DarkModeConfig, Screen } from "tailwindcss/types/config";

const screens: Record<string, number> = {
	xs: 480,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536,
};

const config: Config = {
	content: ["./{public,app}/**/*.{html,js,ts,tsx}"],
	theme: {
		screens: Object.keys(screens).reduce<Screens>((acc, key, index, src) => {
			if (index === 0) {
				acc.smallest = { max: `${screens[key] - 1}px` };
			}
			const min = `${screens[key]}px`;
			acc[key] = min;
			if (index !== src.length - 1) {
				const maxKey = src[index + 1];
				const max = `${screens[maxKey] - 1}px`;
				acc[`${key}-down`] = { max };
				acc[`${key}-only`] = { min, max };
			}
			return acc;
		}, {}),
		// gets rid of text/color/font utils, not doing all that w/ tailwind
		fontFamily: {},
		fontSize: {},
		colors: {},
		accentColor: {},
		backgroundColor: {},
		borderColor: {},
		container: {},
		fontWeight: {},
		lineHeight: {},
	},
};

export default config;

type Screens = Record<string, string | Screen | Screen[]>;
