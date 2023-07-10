/** @type {import('@types/eslint').Linter.BaseConfig} */
const config = {
	extends: [
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"@remix-run/eslint-config/jest-testing-library",
	],
	env: {
		"cypress/globals": true,
	},
	plugins: ["cypress"],
	// we're using vitest which has a very similar API to jest
	// (so the linting plugins work nicely), but it means we have to explicitly
	// set the jest version.
	settings: {
		jest: {
			version: 28,
		},
	},
	rules: {
		"prefer-const": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-unused-vars": "warn",
	},
};
module.exports = config;
