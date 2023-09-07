// Forked because the official plugin is no longer maintained and may have
// issues with newer versions of Node.
// (c) 2022 Jonathan Neal CC0 1.0 Universal
// (CC0 1.0) Public Domain Dedication
// https://github.com/jonathantneal/sass-import-resolve/blob/master/index.mjs
import { SourceMapConsumer, SourceMapGenerator } from "source-map";

import sassResolve from "./sass-import-resolve.mjs";
import sass from "sass";
import path from "node:path";

const sassMatch = /#sass$/;

// https://github.com/csstools/postcss-sass/blob/main/src/index.js
const requiredPostConfig = {
	map: {
		annotation: false,
		inline: false,
		sourcesContent: true,
	},
};

const requiredSassConfig = {
	omitSourceMapUrl: true,
	sourceMap: true,
	sourceMapContents: true,
};

function postcssSass(opts = {}) {
	return {
		postcssPlugin: "postcss-sass",
		Once(root, { result, parse }) {
			// postcss configuration
			const postConfig = Object.assign({}, result.opts, requiredPostConfig);

			// postcss results
			const { css: postCSS, map: postMap } = root.toResult(postConfig);

			// include paths
			const includePaths = [].concat((opts && opts.includePaths) || []);

			// sass engine to use
			const sassEngine = (opts && opts.sass) || sass;

			// sass resolve cache
			const cache = {};

			// replication of the default sass file importer
			const defaultSassImporter = (id, parentId, done) => {
				// resolve the absolute parent
				const parent = path.resolve(parentId);

				// cwds is the list of all directories to search
				const cwds = [path.dirname(parent)]
					.concat(includePaths)
					.map((includePath) => path.resolve(includePath));

				cwds
					.reduce(
						// resolve the first available files
						(promise, cwd) =>
							promise.catch(() =>
								sassResolve(id, {
									cwd,
									cache,
									readFile: true,
								})
							),
						Promise.reject()
					)
					.then(
						({ file, contents }) => {
							// pass the file and contents back to sass
							done({ file, contents });
						},
						(importerError) => {
							// otherwise, pass the error
							done(importerError);
						}
					);
			};

			// sass importer
			const sassImporter = (opts && opts.importer) || defaultSassImporter;

			return new Promise(
				// promise sass results
				(resolve, reject) =>
					sassEngine.render(
						// pass options directly into node-sass
						Object.assign({}, opts, requiredSassConfig, {
							file: `${postConfig.from}#sass`,
							outFile: postConfig.from,
							data: postCSS,
							importer(id, parentId, done) {
								const doneWrap = (importerResult) => {
									const file = importerResult && importerResult.file;

									if (file) {
										const parent = path.resolve(parentId);

										// push the dependency to watch tasks
										result.messages.push({
											type: "dependency",
											file,
											parent,
										});
									}

									done(importerResult);
								};

								// strip the #sass suffix we added
								const prev = parentId.replace(/#sass$/, "");

								// call the sass importer and catch its output
								sassImporter.call(this, id, prev, doneWrap);
							},
						}),
						(sassError, sassResult) =>
							sassError ? reject(sassError) : resolve(sassResult)
					)
			).then(({ css: sassCSS, map: sassMap, stats }) => {
				const parent = path.resolve(postConfig.from);

				// use stats.includedFiles to get the full list of dependencies.  Importer will not receive relative imports.  See https://github.com/sass/dart-sass/issues/574
				for (const includedFile of stats.includedFiles) {
					// strip the #sass suffix we added
					const file = path.resolve(includedFile.replace(/#sass$/, ""));

					// don't include the parent as a dependency of itself
					if (file === parent) {
						continue;
					}

					// push the dependency to watch tasks
					result.messages.push({
						type: "dependency",
						plugin: "postcss-sass",
						file,
						parent,
					});
				}

				return mergeSourceMaps(postMap.toJSON(), JSON.parse(sassMap)).then(
					(prev) => {
						// update root to post-node-sass ast
						result.root = parse(
							sassCSS.toString(),
							Object.assign({}, postConfig, {
								map: { prev },
							})
						);
					}
				);
			});
		},
	};
}

postcssSass.postcss = true;

export { postcssSass };

// https://github.com/csstools/postcss-sass/blob/main/src/merge-source-maps.js
function mergeSourceMaps(...maps) {
	// special sass source matcher

	// new sourcemap
	const generator = new SourceMapGenerator();

	// existing sourcemaps
	const consumersPromise = Promise.all(
		maps.map((map) => new SourceMapConsumer(map))
	);

	return consumersPromise
		.then((consumers) =>
			consumers.forEach((consumer) => {
				// copy each original mapping to the new sourcemap
				consumer.eachMapping((mapping) => {
					const originalPosition = originalPositionFor(mapping, consumers);

					if (originalPosition.source) {
						generator.addMapping({
							generated: {
								line: mapping.generatedLine,
								column: mapping.generatedColumn,
							},
							original: {
								// use positive numbers to work around sass/libsass#2312
								line: Math.abs(originalPosition.line),
								column: Math.abs(originalPosition.column),
							},
							source: originalPosition.source,
							name: originalPosition.name,
						});
					}
				});

				// copy each original source to the new sourcemap
				consumer.sources.forEach((source) => {
					generator._sources.add(source);

					const content = consumer.sourceContentFor(source);

					if (content !== null) {
						generator.setSourceContent(source, content);
					}
				});
			})
		)
		.then(() => {
			// merged map as json
			const mergedMap = JSON.parse(generator);

			// clean all special sass sources in merged map
			mergedMap.sources = mergedMap.sources.map((source) =>
				source.replace(sassMatch, "")
			);

			return mergedMap;
		});
}

function originalPositionFor(mapping, consumers) {
	// initial positioning
	let originalPosition = {
		line: mapping.generatedLine,
		column: mapping.generatedColumn,
	};

	// special sass sources are mapped in reverse
	consumers
		.slice(0)
		.reverse()
		.forEach((consumer) => {
			const possiblePosition = consumer.originalPositionFor(originalPosition);

			if (possiblePosition.source) {
				if (sassMatch.test(possiblePosition.source)) {
					originalPosition = possiblePosition;
				}
			}
		});

	// regular sources are mapped regularly
	consumers.forEach((consumer) => {
		const possiblePosition = consumer.originalPositionFor(originalPosition);

		if (possiblePosition.source) {
			if (!sassMatch.test(possiblePosition.source)) {
				originalPosition = possiblePosition;
			}
		}
	});

	return originalPosition;
}