import { extendComponent } from "$lib/utils";
const styles = require("./html.module.scss");

export const Abbr = html("abbr");
export const Blockquote = html("blockquote");
export const Cite = html("cite");
export const Hr = html("hr");
export const P = html("p");
export const Legend = html("legend");

function html(tag: keyof JSX.IntrinsicElements) {
	tag = tag.toLowerCase() as keyof JSX.IntrinsicElements;
	return extendComponent(tag, {
		displayName: ucFirst(tag),
		className: styles[tag],
	});
}

function ucFirst(str: string) {
	return typeof str === "string"
		? str.charAt(0).toUpperCase() + str.slice(1)
		: "";
}
