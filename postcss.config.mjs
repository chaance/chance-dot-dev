import nodeSassAliasImporter from "node-sass-alias-importer";
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import { postcssSass } from "./scripts/postcss-sass.mjs";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssNesting from "postcss-nesting";
import postcssLogical from "postcss-logical";

const config = (ctx) => {
	const isScss = ctx.file.extname === ".scss";
	const isProd = ctx.env === "production";

	return {
		parser: isScss ? "postcss-scss" : false,
		syntax: isScss ? "postcss-scss" : false,
		plugins: [
			isScss &&
				postcssSass({
					importer: nodeSassAliasImporter({ "~": "." }, { root: "./app" }),
				}),
			!isScss && postcssImport(),
			postcssLogical({ preserve: true }),
			!isScss && postcssNesting(),
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
