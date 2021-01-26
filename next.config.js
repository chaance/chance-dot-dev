const path = require("path");

// https://github.com/hashicorp/next-mdx-enhanced
const withMdxEnhanced = require("next-mdx-enhanced")({
	layoutPath: "src/layouts",
	defaultLayout: true,
	fileExtensions: ["mdx"],
	remarkPlugins: [
		require("remark-images"),
		require("remark-slug"),
		require("@ngsctt/remark-smartypants"),
		// require("./build/title-style"),
	],
	rehypePlugins: [],
	extendFrontMatter: {
		// process: (mdxContent, frontMatter) => {},
		// phase: 'prebuild|loader|both',
	},
	usesSrc: true,
});

module.exports = withMdxEnhanced({
	pageExtensions: ["js", "tsx", "ts", "mdx", "md"],
	sassOptions: {
		includePaths: [path.join(__dirname, "src/styles")],
	},
	//target: "serverless",
	target: "experimental-serverless-trace",
});
