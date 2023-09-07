// (c) 2017 Jonathan Neal
// CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// https://github.com/jonathantneal/sass-import-resolve/blob/master/index.mjs
import fs from "node:fs";
import path from "node:path";

/* Resolve the absolute path of a file in Sass
/* ========================================================================== */

export default function resolve(id, rawopts) {
	const opts = Object.assign(
		{
			cache: {},
			cwd: process.cwd(),
			readFile: false,
		},
		rawopts
	);

	// if `id` starts with `/`
	if (startsWithRoot(id)) {
		// `cwd` is the filesystem root
		opts.cwd = "";
	}

	// `file` is `cwd/id`
	const file = path.join(opts.cwd, id);

	// `base` is the last segment path of `file`
	const base = path.basename(file);

	// `dir` is all but the last segment path of `file`
	const dir = path.dirname(file);

	const tests = [];

	// if `base` ends with `.sass`, `.scss`, or `.css`
	if (endsWithSassExtension(base) || endsWithCssExtension(base)) {
		// test whether `file` exists
		tests.push(testFile(file, opts));

		// if `base` does not start with `_`
		if (!startsWithPartial(base)) {
			// test whether `dir/_base` exists
			tests.push(testFile(path.join(dir, `_${base}`), opts));
		}
	} else {
		// otherwise
		tests.push(
			// test whether `dir/base.scss` exists
			testFile(path.join(dir, `${base}.scss`), opts),
			// test whether `dir/base.sass` exists
			testFile(path.join(dir, `${base}.sass`), opts),
			// test whether `dir/base.css` exists
			testFile(path.join(dir, `${base}.css`), opts)
		);

		// if `base` does not start with `_`
		if (!startsWithPartial(base)) {
			tests.push(
				// test whether `dir/_base.scss` exists
				testFile(path.join(dir, `_${base}.scss`), opts),
				// test whether `dir/_base.sass` exists
				testFile(path.join(dir, `_${base}.sass`), opts),
				// test whether `dir/_base.css` exists
				testFile(path.join(dir, `_${base}.css`), opts)
			);
		}
	}

	return Promise.all(tests)
		.then((test) => test.filter((result) => result))
		.then((files) => {
			// if the length of existing files is `1`
			if (files.length === 1) {
				// return the existing file
				return files[0];
			}

			// otherwise, if the length of existing files is greater than `1`
			if (files.length > 1) {
				// throw `"It's not clear which file to import"`
				throw new Error("It's not clear which file to import");
			}

			// otherwise, if `base` does not end with `.css`
			if (!endsWithCssExtension(base)) {
				// throw `"File to import not found or unreadable"`
				throw new Error("File to import not found or unreadable");
			}
		});
}

/* Additional tooling
/* ========================================================================== */

function testFile(file, opts) {
	opts.cache[file] =
		opts.cache[file] ||
		new Promise((resolvePromise) => {
			if (opts.readFile) {
				fs.readFile(file, "utf8", (error, contents) => {
					if (error) {
						resolvePromise(false);
					} else {
						resolvePromise({
							file,
							contents,
						});
					}
				});
			} else {
				fs.stat(file, (error, stats) => {
					if (error || !stats.isFile()) {
						resolvePromise(false);
					} else {
						resolvePromise({
							file,
						});
					}
				});
			}
		});

	return opts.cache[file];
}

function startsWithRoot(id) {
	return /^\//.test(id);
}

function startsWithPartial(base) {
	return /^_/.test(base);
}

function endsWithCssExtension(base) {
	return /\.css$/i.test(base);
}

function endsWithSassExtension(base) {
	return /\.s[ac]ss$/i.test(base);
}
