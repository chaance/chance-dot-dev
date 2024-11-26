import fs from "node:fs";
import path from "node:path";
import { minimatch } from "minimatch";
import type { DefineRoutesFunction } from "@react-router/remix-routes-option-adapter";

const paramPrefixChar = "$";
const escapeStart = "[";
const escapeEnd = "]";
const optionalStart = "(";
const optionalEnd = ")";

const routeModuleExts = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"];

function isRouteModuleFile(filename: string) {
	return routeModuleExts.includes(path.extname(filename));
}

/**
 * Defines routes using the filesystem convention in `app/routes`. The rules are:
 *
 * - Route paths are derived from the file path. A `.` in the filename indicates
 *   a `/` in the URL (a "nested" URL, but no route nesting). A `$` in the
 *   filename indicates a dynamic URL segment.
 * - Subdirectories are used for nested routes.
 *
 * For example, a file named `app/routes/gists/$username.tsx` creates a route
 * with a path of `gists/:username`.
 *
 * @param {DefineRoutesFunction} defineRoutes
 * @param {CreateRoutesFromFoldersOptions} [options]
 * @returns {RouteManifest}
 */
export function createRoutesFromFolders(
	defineRoutes: DefineRoutesFunction,
	options: CreateRoutesFromFoldersOptions = {},
): RouteManifest {
	let {
		appDirectory = "app",
		ignoredFilePatterns = [],
		routesDirectory = "routes",
	} = options;

	let appRoutesDirectory = path.join(appDirectory, routesDirectory);
	/** @type {{ [routeId: string]: string }} */
	let files: { [routeId: string]: string } = {};

	// First, find all route modules in app/routes
	visitFiles(appRoutesDirectory, (file) => {
		if (
			ignoredFilePatterns.length > 0 &&
			ignoredFilePatterns.some((pattern) => minimatch(file, pattern))
		) {
			return;
		}

		if (isRouteModuleFile(file)) {
			let relativePath = path.join(routesDirectory, file);
			let routeId = createRouteId(relativePath);
			files[routeId] = relativePath;
			return;
		}

		throw new Error(
			`Invalid route module file: ${path.join(appRoutesDirectory, file)}`,
		);
	});

	let routeIds = Object.keys(files).sort(byLongestFirst);
	let parentRouteIds = getParentRouteIds(routeIds);
	/** @type {Map<string, string>} */
	let uniqueRoutes: Map<string, string> = new Map();

	// Then, recurse through all routes using the public defineRoutes() API
	function defineNestedRoutes(
		defineRoute: DefineRouteFunction,
		parentId?: string,
	) {
		let childRouteIds = routeIds.filter((id) => {
			return parentRouteIds[id] === parentId;
		});

		for (let routeId of childRouteIds) {
			/** @type {string | undefined} */
			let routePath: string | undefined = createRoutePath(
				routeId.slice((parentId || routesDirectory).length + 1),
			);

			let isIndexRoute = routeId.endsWith("/index");
			let fullPath = createRoutePath(routeId.slice(routesDirectory.length + 1));
			let uniqueRouteId = (fullPath || "") + (isIndexRoute ? "?index" : "");
			let isPathlessLayoutRoute =
				routeId.split("/").pop()?.startsWith("__") === true;

			/**
			 * We do not try to detect path collisions for pathless layout route
			 * files because, by definition, they create the potential for route
			 * collisions _at that level in the tree_.
			 *
			 * Consider example where a user may want multiple pathless layout routes
			 * for different subfolders
			 *
			 *   routes/
			 *     account.tsx
			 *     account/
			 *       __public/
			 *         login.tsx
			 *         perks.tsx
			 *       __private/
			 *         orders.tsx
			 *         profile.tsx
			 *       __public.tsx
			 *       __private.tsx
			 *
			 * In order to support both a public and private layout for `/account/*`
			 * URLs, we are creating a mutually exclusive set of URLs beneath 2
			 * separate pathless layout routes.  In this case, the route paths for
			 * both account/__public.tsx and account/__private.tsx is the same
			 * (/account), but we're again not expecting to match at that level.
			 *
			 * By only ignoring this check when the final portion of the filename is
			 * pathless, we will still detect path collisions such as:
			 *
			 *   routes/parent/__pathless/foo.tsx
			 *   routes/parent/__pathless2/foo.tsx
			 *
			 * and
			 *
			 *   routes/parent/__pathless/index.tsx
			 *   routes/parent/__pathless2/index.tsx
			 */
			if (uniqueRouteId && !isPathlessLayoutRoute) {
				if (uniqueRoutes.has(uniqueRouteId)) {
					throw new Error(
						`Path ${JSON.stringify(fullPath || "/")} defined by route ` +
							`${JSON.stringify(routeId)} conflicts with route ` +
							`${JSON.stringify(uniqueRoutes.get(uniqueRouteId))}`,
					);
				} else {
					uniqueRoutes.set(uniqueRouteId, routeId);
				}
			}

			if (isIndexRoute) {
				let invalidChildRoutes = routeIds.filter(
					(id) => parentRouteIds[id] === routeId,
				);

				if (invalidChildRoutes.length > 0) {
					throw new Error(
						`Child routes are not allowed in index routes. Please remove child routes of ${routeId}`,
					);
				}

				defineRoute(routePath, files[routeId], { index: true, id: routeId });
			} else {
				defineRoute(routePath, files[routeId], { id: routeId }, () => {
					defineNestedRoutes(defineRoute, routeId);
				});
			}
		}
	}

	return defineRoutes(defineNestedRoutes);
}

/**
 * @param {string} partialRouteId
 * @returns {string | undefined}
 */
export function createRoutePath(partialRouteId: string): string | undefined {
	let result = "";
	let rawSegmentBuffer = "";

	let inEscapeSequence = 0;
	let inOptionalSegment = 0;
	let optionalSegmentIndex = null;
	let skipSegment = false;
	for (let i = 0; i < partialRouteId.length; i++) {
		let char = partialRouteId.charAt(i);
		let prevChar = i > 0 ? partialRouteId.charAt(i - 1) : undefined;
		let nextChar =
			i < partialRouteId.length - 1 ? partialRouteId.charAt(i + 1) : undefined;

		if (skipSegment) {
			if (isSegmentSeparator(char)) {
				skipSegment = false;
			}
			continue;
		}

		// 1. check if we're in a new escape sequence
		if (!inEscapeSequence && char === escapeStart && prevChar !== escapeStart) {
			inEscapeSequence++;
			continue;
		}

		// 2. check if we're in a close escape sequence
		if (inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd) {
			inEscapeSequence--;
			continue;
		}

		// 3. check if we're in a new optional segment
		if (
			char === optionalStart &&
			prevChar !== optionalStart &&
			(isSegmentSeparator(prevChar) || prevChar === undefined) &&
			!inOptionalSegment &&
			!inEscapeSequence
		) {
			inOptionalSegment++;
			optionalSegmentIndex = result.length;
			result += optionalStart;
			continue;
		}

		// 4. check if we're in a close optional segment
		if (
			char === optionalEnd &&
			nextChar !== optionalEnd &&
			(isSegmentSeparator(nextChar) || nextChar === undefined) &&
			inOptionalSegment &&
			!inEscapeSequence
		) {
			if (optionalSegmentIndex !== null) {
				result =
					result.slice(0, optionalSegmentIndex) +
					result.slice(optionalSegmentIndex + 1);
			}
			optionalSegmentIndex = null;
			inOptionalSegment--;
			result += "?";
			continue;
		}

		// 5. check if we're in any other escape sequence
		if (inEscapeSequence) {
			result += char;
			continue;
		}

		// 6. check if we're in a new segment
		if (isSegmentSeparator(char)) {
			if (rawSegmentBuffer === "index" && result.endsWith("index")) {
				result = result.replace(/\/?index$/, "");
			} else {
				result += "/";
			}

			rawSegmentBuffer = "";
			inOptionalSegment = 0;
			optionalSegmentIndex = null;
			continue;
		}

		// 7. check if we're in a new layout segment
		if (isStartOfLayoutSegment(char, nextChar)) {
			skipSegment = true;
			continue;
		}

		// 8. Regular route, commence the routing!
		rawSegmentBuffer += char;

		if (char === paramPrefixChar) {
			if (nextChar === optionalEnd) {
				throw new Error(
					`Invalid route path: ${partialRouteId}. Splat route $ is already optional`,
				);
			}
			result += typeof nextChar === "undefined" ? "*" : ":";
			continue;
		}

		result += char;
	}

	if (rawSegmentBuffer === "index" && result.endsWith("index")) {
		result = result.replace(/\/?index$/, "");
	} else {
		result = result.replace(/\/$/, "");
	}

	if (rawSegmentBuffer === "index" && result.endsWith("index?")) {
		throw new Error(
			`Invalid route path: ${partialRouteId}. Make index route optional by using (index)`,
		);
	}

	return result || undefined;

	/**
	 * @param {string} char
	 * @param {string | undefined} nextChar
	 */
	function isStartOfLayoutSegment(char: string, nextChar: string | undefined) {
		return char === "_" && nextChar === "_" && !rawSegmentBuffer;
	}
}

/**
 * @param {string | undefined} checkChar
 */
function isSegmentSeparator(checkChar: string | undefined) {
	if (!checkChar) return false;
	return ["/", ".", path.win32.sep].includes(checkChar);
}

/**
 *
 * @param {string[]} routeIds
 * @returns {Record<string, string | undefined>}
 */
function getParentRouteIds(
	routeIds: string[],
): Record<string, string | undefined> {
	return routeIds.reduce(
		(parentRouteIds, childRouteId) => ({
			...parentRouteIds,
			[childRouteId]: routeIds.find((id) => childRouteId.startsWith(`${id}/`)),
		}),
		{},
	);
}

/**
 * @param {string} a
 * @param {string} b
 */
function byLongestFirst(a: string, b: string) {
	return b.length - a.length;
}

/**
 *
 * @param {string} dir
 * @param {(file: string) => void} visitor
 * @param {string} [baseDir]
 */
function visitFiles(
	dir: string,
	visitor: (file: string) => void,
	baseDir: string = dir,
) {
	for (let filename of fs.readdirSync(dir)) {
		let file = path.resolve(dir, filename);
		let stat = fs.lstatSync(file);

		if (stat.isDirectory()) {
			visitFiles(file, visitor, baseDir);
		} else if (stat.isFile()) {
			visitor(path.relative(baseDir, file));
		}
	}
}

type CreateRoutesFromFoldersOptions = {
	appDirectory?: string;
	ignoredFilePatterns?: string[];
	routesDirectory?: string;
};

type DefineRouteFunction = Parameters<Parameters<DefineRoutesFunction>[0]>[0];
type RouteManifest = ReturnType<DefineRoutesFunction>;

function createRouteId(file: string) {
	return normalizeSlashes(stripFileExtension(file));
}

function normalizeSlashes(file: string) {
	return file.split(path.win32.sep).join("/");
}

function stripFileExtension(file: string) {
	return file.replace(/\.[a-z0-9]+$/i, "");
}
