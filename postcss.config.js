import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";

/** @type {import('postcss-load-config').Config} */
export default {
	plugins: [
		// Make the `@custom-media` definitions available to every stylesheet
		postcssGlobalData({ files: ["app/styles/media.css"] }),
		postcssCustomMedia(),
	],
};
