import postcssGlobalData from "@csstools/postcss-global-data";
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssNesting from "postcss-nesting";

const config = (ctx) => {
	const isProd = ctx.env === "production";
	return {
		plugins: [
			postcssGlobalData({
				files: ["app/styles/system/media.css"],
			}),
			postcssImport(),
			postcssNesting(),
			postcssCustomMedia(),
			autoprefixer({
				flexbox: false,
				grid: false,
			}),
			isProd && cssnano({ preset: "default" }),
		].filter(Boolean),
	};
};

export default config;
