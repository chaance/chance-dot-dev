import path from "node:path";
import url from "node:url";
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssNesting from "postcss-nesting";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const config = (ctx) => {
	const isProd = ctx.env === "production";
	return {
		plugins: [
			postcssImport({
				resolve: (id) => {
					// resolve `~/` prefixed imports to the `app` directory
					if (id.startsWith("~/")) {
						return path.resolve(__dirname, `app/${id.slice(2)}`);
					}
					return id;
				},
			}),
			postcssGlobalData({
				files: ["app/styles/system/media.css"],
			}),
			postcssNesting(),
			postcssCustomMedia(),
			autoprefixer({ flexbox: false, grid: false }),
			isProd && cssnano({ preset: "default" }),
		].filter(Boolean),
	};
};

export default config;
