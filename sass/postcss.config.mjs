// @ts-nocheck
import path from "node:path";
import postcssGlobalData from "@csstools/postcss-global-data";
import nodeSassAliasImporter from "node-sass-alias-importer";
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import { postcssSass } from "../scripts/postcss-sass.mjs";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssNesting from "postcss-nesting";

const config = (ctx) => {
	const isScss = ctx.file.extname === ".scss";
	const isProd = ctx.env === "production";

	return {
		parser: isScss ? "postcss-scss" : false,
		syntax: isScss ? "postcss-scss" : false,
		plugins: [
			postcssGlobalData({
				files: [path.resolve(process.cwd(), "app/styles/system", "media.css")],
			}),
			isScss &&
				postcssSass({
					importer: nodeSassAliasImporter({ "~": "." }, { root: "./app" }),
				}),
			!isScss && postcssImport(),
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
