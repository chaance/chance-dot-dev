import parseFrontMatter from "front-matter";
import rangeParser from "parse-numeric-range";
import { isString } from "~/lib/utils";
import { LRUCache } from "lru-cache";
import type { Tinypool as TTinypool } from "tinypool";

import type * as Unist from "unist";
import type * as Hast from "hast";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NO_CACHE = process.env.NO_CACHE;

let tokenizePool: TTinypool;

export const markdownCache = new LRUCache<string, MarkdownParsed>({
	max: 300,
	ttl: 1000 * 60 * 5, // 5 minutes
	allowStale: true,
	maxSize: 1024 * 1024 * 12, // 12mb
	sizeCalculation(value, key) {
		return JSON.stringify(value).length + (key ? key.length : 0);
	},
});

export interface MarkdownParsed {
	markdown: string;
	html: string;
}

export async function processMarkdown(content: string) {
	let processor = await getProcessor();
	let vfile = await processor.process(content);
	return typeof vfile.value === "string" ? vfile.value : vfile.value.toString();
}

export async function parseMarkdown(
	key: string,
	contents: string
): Promise<MarkdownParsed | null> {
	// if (!NO_CACHE) {
	// 	let cached = markdownCache.get(key);
	// 	if (cached) {
	// 		return cached;
	// 	}
	// }

	let { body: markdown } = parseFrontMatter(contents);
	let html = await processMarkdown(markdown);
	let parsed = { markdown, html };
	// if (!NO_CACHE) {
	// 	markdownCache.set(key, parsed);
	// }
	return parsed;
}

export interface ProcessorOptions {
	resolveHref?(href: string): string;
}

async function getProcessor(options: ProcessorOptions = {}) {
	let [
		{ unified },
		{ default: remarkGfm },
		{ default: remarkParse },
		{ default: remarkRehype },
		{ default: rehypeSlug },
		{ default: rehypeStringify },
		plugins,
	] = await Promise.all([
		import("unified"),
		import("remark-gfm"),
		import("remark-parse"),
		import("remark-rehype"),
		import("rehype-slug"),
		import("rehype-stringify"),
		getPlugins(),
	]);

	return (
		unified()
			.use(remarkParse)
			.use(plugins.stripLinkExtPlugin, options)
			.use(plugins.remarkCodeBlocksPlugin)
			// .use(plugins.responsiveImagesPlugin)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeStringify, { allowDangerousHtml: true })
			.use(rehypeSlug, { prefix: "md-" })
	);
}

async function getPlugins() {
	// Shiki Theme values
	let langs = [
		"css",
		"diff",
		"html",
		// Not supported, sadness
		// @ts-ignore
		// "http",
		"js",
		"javascript",
		"json",
		"jsx",
		"markdown",
		"md",
		"mdx",
		"prisma",
		"scss",
		"shellscript",
		"ts",
		"typescript",
		"tsx",
	];
	let langSet = new Set(langs);

	let [{ visit, SKIP }, { htmlEscape }, { Tinypool }] = await Promise.all([
		import("unist-util-visit"),
		import("escape-goat"),
		import("tinypool"),
	]);

	return {
		stripLinkExtPlugin(options: ProcessorOptions) {
			return async function transformer(tree: UnistNode.Root): Promise<void> {
				visit(tree, "link", (node, index, parent) => {
					if (
						options.resolveHref &&
						isString(node.url) &&
						isRelativeUrl(node.url)
					) {
						if (parent && index != null) {
							parent.children[index] = {
								...node,
								url: options.resolveHref(node.url),
							};
							return SKIP;
						}
					}
				});
			};
		},
		responsiveImagesPlugin() {
			return async function transformer(tree: UnistNode.Root): Promise<void> {
				visit(tree, "image", (node, index, parent) => {
					if (!parent || index == null) return;

					parent.type = "element";
					let srcBase = node.url;
					let ext = srcBase.slice(srcBase.lastIndexOf("."));
					let hChildren = [...parent.children] as Hast.Element[];
					let getSrc = (variant: string) =>
						srcBase.slice(0, srcBase.lastIndexOf(".")) + "-" + variant + ext;

					hChildren.splice(index, 1, {
						type: "element",
						tagName: "img",
						properties: {
							src: srcBase,
							alt: node.alt,
							// TODO: Check if these are in the images directory first, and
							// generate dynamically
							srcSet: ["2000", "1024", "640"].reduce(
								(prev, cur) => `${prev}, ${getSrc(cur)} ${cur}w`,
								""
							),
							sizes:
								"(min-width: 1024px) 2000px, (min-width: 768px) 1024px, 640px",
							loading: "lazy",
						},
						children: [],
					});

					parent.data = {
						hName: "figure",
						hChildren,
					};
					return SKIP;
				});
			};
		},
		remarkCodeBlocksPlugin() {
			// Using Tinypool because Shiki has memory leaks. See notes in
			// shiki-worker.js for details.
			tokenizePool =
				tokenizePool ||
				new Tinypool({
					// worker directory is relative to the build output
					filename: new URL("../workers/shiki-worker.js", import.meta.url)
						.pathname,
					minThreads: 0,
					idleTimeout: 60,
				});

			return async function transformer(tree: UnistNode.Root): Promise<void> {
				let transformTasks: Array<() => Promise<void>> = [];
				visit(tree, "code", (node) => {
					if (!node.lang || !node.value || !langSet.has(node.lang)) {
						return;
					}

					if (node.lang === "js") node.lang = "javascript";
					if (node.lang === "ts") node.lang = "typescript";
					let language = node.lang;
					let code = node.value;
					let {
						addedLines,
						highlightLines,
						nodeProperties,
						removedLines,
						startingLineNumber,
						usesLineNumbers,
					} = getCodeBlockMeta();

					transformTasks.push(highlightNodes);
					return SKIP;

					async function highlightNodes() {
						let { bgColor, fgColor, tokens } = await getThemedTokens({
							code,
							language,
						});
						let children = tokens.map(
							(lineTokens, zeroBasedLineNumber): Hast.Element => {
								let children = lineTokens.map(
									(token): Hast.Text | Hast.Element => {
										let color = convertFakeHexToCustomProp(token.color || "");
										let content: Hast.Text = {
											type: "text",
											// Do not escape the _actual_ content
											value: token.content,
										};

										return color && color !== fgColor
											? {
													type: "element",
													tagName: "span",
													properties: {
														style: `color: ${htmlEscape(color)}`,
													},
													children: [content],
											  }
											: content;
									}
								);

								children.push({
									type: "text",
									value: "\n",
								});

								let isDiff = addedLines.length > 0 || removedLines.length > 0;
								let diffLineNumber = startingLineNumber - 1;
								let lineNumber = zeroBasedLineNumber + startingLineNumber;
								let highlightLine = highlightLines?.includes(lineNumber);
								let removeLine = removedLines.includes(lineNumber);
								let addLine = addedLines.includes(lineNumber);
								if (!removeLine) {
									diffLineNumber++;
								}

								return {
									type: "element",
									tagName: "span",
									properties: {
										className: "codeblock-line",
										dataHighlight: highlightLine ? "true" : undefined,
										dataLineNumber: usesLineNumbers ? lineNumber : undefined,
										dataAdd: isDiff ? addLine : undefined,
										dataRemove: isDiff ? removeLine : undefined,
										dataDiffLineNumber: isDiff ? diffLineNumber : undefined,
									},
									children,
								};
							}
						);

						let nodeValue = {
							type: "element",
							tagName: "pre",
							properties: {
								...nodeProperties,
								dataLineNumbers: usesLineNumbers ? "true" : "false",
								dataLang: htmlEscape(language),
								style: `color: ${htmlEscape(
									fgColor
								)};background-color: ${htmlEscape(bgColor)}`,
							},
							children: [
								{
									type: "element",
									tagName: "code",
									children,
								},
							],
						};

						let data = node.data ?? {};
						(node as any).type = "element";
						data.hProperties ??= {};
						data.hChildren = [nodeValue];
						node.data = data;
					}

					function getCodeBlockMeta() {
						// TODO: figure out how this is ever an array?
						let meta = Array.isArray(node.meta) ? node.meta[0] : node.meta;

						let metaParams = new URLSearchParams();
						if (meta) {
							let linesHighlightsMetaShorthand = meta.match(/^\[(.+)\]$/);
							if (linesHighlightsMetaShorthand) {
								metaParams.set("lines", linesHighlightsMetaShorthand[0]);
							} else {
								metaParams = new URLSearchParams(meta.split(/\s+/).join("&"));
							}
						}

						let addedLines = parseLineHighlights(metaParams.get("add"));
						let removedLines = parseLineHighlights(metaParams.get("remove"));
						let highlightLines = parseLineHighlights(metaParams.get("lines"));
						let startValNum = metaParams.has("start")
							? Number(metaParams.get("start"))
							: 1;
						let startingLineNumber = Number.isFinite(startValNum)
							? startValNum
							: 1;
						let usesLineNumbers = !metaParams.has("nonumber");

						let nodeProperties: { [key: string]: string } = {};
						metaParams.forEach((val, key) => {
							if (key === "lines") return;
							nodeProperties[`data-${key}`] = val;
						});

						return {
							addedLines,
							highlightLines,
							nodeProperties,
							removedLines,
							startingLineNumber,
							usesLineNumbers,
						};
					}
				});

				await Promise.all(transformTasks.map((exec) => exec()));

				async function getThemedTokens(
					args: WorkerArgs
				): Promise<WorkerResult> {
					return await tokenizePool.run(args);
				}
			};
		},
	};
}

function parseLineHighlights(param: string | null) {
	let range = param?.match(/^\[(.+)\]$/);
	if (!range) {
		return [];
	}
	return rangeParser(range[1]);
}

// The theme actually stores #FFFF${base-16-color-id} because vscode-textmate
// requires colors to be valid hex codes, if they aren't, it changes them to a
// default, so this is a mega hack to trick it.
function convertFakeHexToCustomProp(color: string) {
	return color.replace(/^#FFFF(.+)/, "var(--base$1)");
}

function isRelativeUrl(test: string) {
	// Probably fragile but should work well enough. It would be nice if the
	// consumer could provide a baseURI we could do something like:
	//   - new URL(baseURI).origin === new URL(test, baseURI).origin
	return !/^(?:[a-z]+:)?\/\//i.test(test);
}

namespace UnistNode {
	export type Content = Flow | Phrasing | Html;
	export interface Root extends Unist.Parent {
		type: "root";
		children: Flow[];
	}

	export type Flow =
		| Blockquote
		| Heading
		| ParagraphNode
		| Link
		| Pre
		| Code
		| Image
		| Elem
		| Html;

	export interface Html extends Unist.Node {
		type: "html";
		value: string;
	}

	export interface Elem extends Unist.Parent {
		type: "element";
	}

	export interface Image extends Unist.Node {
		type: "image";
		title: null;
		url: string;
		alt?: string;
	}

	export interface Blockquote extends Unist.Parent {
		type: "blockquote";
		children: Flow[];
	}

	export interface Heading extends Unist.Parent {
		type: "heading";
		depth: number;
		children: UnistNode.Phrasing[];
	}

	interface ParagraphNode extends Unist.Parent {
		type: "paragraph";
		children: Phrasing[];
	}

	export interface Pre extends Unist.Parent {
		type: "pre";
		children: Phrasing[];
	}

	export interface Code extends Unist.Parent {
		type: "code";
		value?: string;
		lang?: string;
		meta?: string | string[];
	}

	export type Phrasing = Text | Emphasis;

	export interface Emphasis extends Unist.Parent {
		type: "emphasis";
		children: Phrasing[];
	}

	export interface Link extends Unist.Parent {
		type: "link";
		children: Flow[];
		url?: string;
	}

	export interface Text extends Unist.Literal {
		type: "text";
		value: string;
	}
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type WorkerFn = typeof import("~/../workers/shiki-worker").default;
type WorkerArgs = Parameters<WorkerFn>[0];
type WorkerResult = Awaited<ReturnType<WorkerFn>>;
