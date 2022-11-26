import type { User } from "~/models/user.server";

export const canUseDOM = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
);

export function getServerEnvVar(key: string) {
	if (canUseDOM) {
		throw new Error(
			`Attempted to access server environment variables outside of the server environment.`
		);
	}
	return process.env[key];
}

export function getRequiredServerEnvVar(key: string) {
	let envVal = getServerEnvVar(key);
	if (!envVal) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return envVal;
}

export function getBrowserEnvVar(key: string) {
	if (!canUseDOM) {
		throw new Error(
			`Attempted to access browser environment variables outside of the browser environment.`
		);
	}
	// @ts-expect-error
	let envVal = window.__chance_dot_dev_env[key];
	if (typeof envVal !== "undefined" && typeof envVal !== "string") {
		throw new TypeError(
			`Invalid type for environment variable ${key}. Expected string; got ${typeof envVal}.`
		);
	}
	return envVal;
}

export function getRequiredBrowserEnvVar(key: string) {
	let envVal = getBrowserEnvVar(key);
	if (!envVal) {
		throw new Error(`Missing environment variable: ${key}`);
	}
	return envVal;
}

export function setBrowserEnvVar(key: string, value: string) {
	if (!canUseDOM) {
		throw new Error(
			`Attempted to set a browser environment variable outside of the browser environment.`
		);
	}
	if (!("__chance_dot_dev_env" in window)) {
		// @ts-expect-error
		window.__chance_dot_dev_env = {};
	}
	// @ts-expect-error
	window.__chance_dot_dev_env[key] = value;
}

export function validateEmail(email: unknown): email is string {
	return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function isUser(user: any): user is User {
	return user && typeof user === "object" && typeof user.email === "string";
}
