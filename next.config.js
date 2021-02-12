const path = require("path");
module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, "src/styles")],
	},
	//target: "serverless",
	target: "experimental-serverless-trace",
	pageExtensions: ["js", "jsx", "tsx", "mdx"],
	webpack(config, options) {
		config.module.rules.push({
			test: /\.mdx$/,
			use: [
				options.defaultLoaders.babel,
				{
					loader: require.resolve("@mdx-js/loader"),
					options: {
						remarkPlugins: [
							require("remark-images"),
							require("remark-slug"),
							require("@ngsctt/remark-smartypants"),
						],
						rehypePlugins: [],
					},
				},
			],
		});
		return config;
	},
};
