module.exports = (ctx) => {
	let isScss = ctx.file.extname === ".scss";
	let isProd = ctx.env === "production";

	return {
		parser: isScss ? "postcss-scss" : false,
		syntax: isScss ? "postcss-scss" : false,
		plugins: [
			isScss &&
				require("@csstools/postcss-sass")({
					importer: require("node-sass-alias-importer")(
						{ "~": "." },
						{ root: "./app" }
					),
				}),
			!isScss && require("postcss-import")(),
			require("postcss-logical")({
				preserve: true,
			}),
			!isScss && require("postcss-nesting")(),
			require("postcss-custom-media")(),
			require("autoprefixer")({
				flexbox: false,
				grid: false,
			}),
			isProd && require("cssnano")({ preset: "default" }),
		].filter(Boolean),
	};
};
