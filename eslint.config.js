import globals from "globals";
import * as js from "@chance/eslint";
import * as react from "@chance/eslint/react";
import * as typescript from "@chance/eslint/typescript";
// @ts-expect-error
import reactRefresh from "eslint-plugin-react-refresh";

/** @type {LinterConfig[]} */
const configs = [
	{
		ignores: [
			".react-router/**/*",
			"./build/*",
			"./public/build/*",
			"./app/dist",
			"./app/lib/prisma",
		],
	},
	{
		files: ["scripts/**/*", "mocks/**/*", "server/**/*", "server.mjs"],
		languageOptions: { globals: globals.node },
	},
	js.config,
	typescript.config,
	{
		...react.config,
		plugins: {
			...react.config.plugins,
			"react-refresh": reactRefresh,
		},
	},
	{
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"react-refresh/only-export-components": [
				"warn",
				{
					allowConstantExport: true,
					allowExportNames: ["meta", "links", "headers", "loader", "action"],
				},
			],
		},
	},
];

export default configs;

/**
 * @typedef {import("eslint").Linter.Config} LinterConfig
 */
