import path from "node:path";
import url from "node:url";
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import tailwindcssNesting from "tailwindcss/nesting/index.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {import('postcss-load-config').ConfigContext} ctx
 * @returns {import('postcss-load-config').Config}
 */
function config(ctx) {
	const isProd = ctx.env === "production";
	return {
		plugins: [
			postcssImport({
				resolve: (id) => {
					console.log(`resolving ${id} from ${__dirname}`);
					// resolve `~/` prefixed imports to the `app` directory
					if (id.startsWith("~/")) {
						return path.resolve(__dirname, `app/${id.slice(2)}`);
					}
					return id;
				},
			}),
			postcssGlobalData({
				files: ["app/styles/media.css"],
			}),
			tailwindcssNesting(),
			tailwindcss(),
			postcssCustomMedia(),
			autoprefixer({ flexbox: false, grid: false }),
			isProd && cssnano({ preset: "default" }),
		].filter(isTruthy),
	};
}

export default config;

/**
 * @template T
 * @param {T} value
 * @returns {value is Exclude<T, false | null | 0 | "" | undefined>}
 */
function isTruthy(value) {
	return !!value;
}
