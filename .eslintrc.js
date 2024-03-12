/** @type {import('@types/eslint').Linter.BaseConfig} */
const config = {
	extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
	rules: {
		"prefer-const": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-non-null-asserted-optional-chain": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-unused-vars": "warn",
	},
};
module.exports = config;
