import kebabCase from "lodash/kebabCase";
import type { User } from "~/models/user.server";

// MIT License, Copyright (c) Sindre Sorhus
// https://github.com/sindresorhus/email-regex/blob/main/index.js
const EMAIL_REGEX =
	"[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*";

export const canUseDOM = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
);

export function isFunction(value: any): value is Function {
	return typeof value === "function";
}

export function isObject(
	value: any
): value is { [key in string | number | symbol]: any } {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: any): value is string {
	return typeof value === "string";
}

export function isBoolean(value: any): value is boolean {
	return typeof value === "boolean";
}

export function getServerEnvVar(key: string) {
	if (canUseDOM) {
		throw new Error(
			`Attempted to access server environment variables outside of the server environment.`
		);
	}
	return process.env[key];
}

export function documentReady(): Promise<void> {
	if (!canUseDOM) {
		return Promise.reject(Error("Cannot call documentReady on the server"));
	}
	if (document.body) {
		return Promise.resolve();
	}

	return new Promise<void>((res) => {
		document.addEventListener("DOMContentLoaded", function listener() {
			document.removeEventListener("DOMContentLoaded", listener);
			res();
		});
	});
}

export function unSlashIt(str: string) {
	return str.replace(/^(\/*)|(\/*)$/g, "");
}

export function leadingSlashIt(str: string) {
	return "/" + unSlashIt(str);
}

export function trailingSlashIt(str: string) {
	return unSlashIt(str) + "/";
}

export function doubleSlashIt(str: string) {
	return "/" + unSlashIt(str) + "/";
}

// https://github.com/sindresorhus/is-absolute-url/blob/main/index.js
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;

export function isAbsoluteUrl(url: string) {
	if (WINDOWS_PATH_REGEX.test(url)) {
		return false;
	}
	return ABSOLUTE_URL_REGEX.test(url);
}

export function shallowEqual(x: any, y: any): boolean {
	if (Object.is(x, y)) {
		return true;
	}

	if (
		typeof x !== "object" ||
		x === null ||
		typeof y !== "object" ||
		y === null
	) {
		return false;
	}

	let keysA = Object.keys(x);
	let keysB = Object.keys(y);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	for (let i = 0; i < keysA.length; i++) {
		let currentKey = keysA[i];
		if (
			!Object.prototype.hasOwnProperty.call(y, currentKey) ||
			!Object.is(x[currentKey], y[currentKey])
		) {
			return false;
		}
	}

	return true;
}

export function debugOverflowXCulprit() {
	if (!canUseDOM) return;
	for (let el of document.querySelectorAll("*")) {
		if (
			el instanceof HTMLElement &&
			el.offsetWidth > document.documentElement.offsetWidth
		) {
			console.log(el);
		}
	}
}

export function typedBoolean<T>(
	value: T
): value is Exclude<T, "" | 0 | false | null | undefined> {
	return Boolean(value);
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

export function isNonEmptyString(val: any): val is string {
	return isString(val) && val.length > 0;
}

type PasswordValidationError =
	| { type: "tooShort"; minLength: number }
	| { type: "tooLong"; maxLength: number }
	| { type: "missingSpecialChar"; specialChars: string }
	| { type: "missingUpperCase" }
	| { type: "missingLowerCase" }
	| { type: "missingNumber" };

export function validatePassword(password: string): PasswordValidationError[] {
	let maxLength = 50;
	let minLength = 8;
	let requiresLowerCase = true;
	let requiresUpperCase = true;
	let requiresNumber = true;
	let requiresSpecialChar = true;
	let specialChars = "!@#$%^&*()_+-=[]{}|;:'\"`,.<>?~";

	let errors: PasswordValidationError[] = [];
	if (password.length < minLength) {
		errors.push({ type: "tooShort", minLength });
	}
	if (password.length > maxLength) {
		errors.push({ type: "tooLong", maxLength });
	}
	if (requiresLowerCase && !/[a-z]/.test(password)) {
		errors.push({ type: "missingLowerCase" });
	}
	if (requiresUpperCase && !/[A-Z]/.test(password)) {
		errors.push({ type: "missingUpperCase" });
	}
	if (requiresNumber && !/[0-9]/.test(password)) {
		errors.push({ type: "missingNumber" });
	}
	if (
		requiresSpecialChar &&
		!new RegExp(`[${specialChars.replace("]", "\\]")}]`).test(password)
	) {
		errors.push({ type: "missingSpecialChar", specialChars });
	}
	return errors;
}

export function getPasswordErrorMessage(error: PasswordValidationError) {
	switch (error.type) {
		case "tooShort":
			return `Password must be at least ${error.minLength} characters`;
		case "tooLong":
			return `Password must be at most ${error.maxLength} characters`;
		case "missingSpecialChar":
			return `Password must contain at least one of the following special characters: ${error.specialChars}`;
		case "missingUpperCase":
			return `Password must contain at least one uppercase letter`;
		case "missingLowerCase":
			return `Password must contain at least one lowercase letter`;
		case "missingNumber":
			return `Password must contain at least one numbeer`;
		default:
			return "Invalid password";
	}
}

export function isUser(user: any): user is User {
	return user && typeof user === "object" && typeof user.email === "string";
}

export function slugify(str: string) {
	return kebabCase(str);
}

export function getHttpStatusText(status: number) {
	try {
		let resp = new Response(null, { status });
		if (resp.statusText === "") {
			throw null;
		}
		return resp.statusText;
	} catch (err) {
		throw Error(`Invalid status code: ${status}`);
	}
}

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/platform.ts
 */

function testUserAgent(re: RegExp) {
	if (!canUseDOM || window.navigator == null) {
		return false;
	}
	return (
		window.navigator["userAgentData"]?.brands.some((brand) =>
			re.test(brand.brand)
		) || re.test(window.navigator.userAgent)
	);
}

function testPlatform(re: RegExp) {
	return typeof window !== "undefined" && window.navigator != null
		? re.test(
				window.navigator["userAgentData"]?.platform || window.navigator.platform
		  )
		: false;
}

export function isMac() {
	return testPlatform(/^Mac/i);
}

export function isIPhone() {
	return testPlatform(/^iPhone/i);
}

export function isIPad() {
	return (
		testPlatform(/^iPad/i) ||
		// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

export function isIOS() {
	return isIPhone() || isIPad();
}

export function isAppleDevice() {
	return isMac() || isIOS();
}

export function isWebKit() {
	return testUserAgent(/AppleWebKit/i) && !isChrome();
}

export function isSafari() {
	return isWebKit() && testUserAgent(/Safari/i);
}

export function isMozilla() {
	return !isSafari() && testUserAgent(/Mozilla/i);
}

export function isChrome() {
	return testUserAgent(/Chrome/i);
}

export function isAndroid() {
	return testUserAgent(/Android/i);
}

interface NavigatorUAData {
	platform: string;
	mobile: boolean;
	brands: Array<{
		brand: string;
		version: string;
	}>;
}

declare global {
	interface Navigator {
		userAgentData?: NavigatorUAData;
	}
}

export function getExcerpt(string: string, maxWords: number) {
	string = string.trim();
	let excerpt = "";
	let words: string[] = [];
	for (let segment of string.split(" ")) {
		if (!segment) {
			continue;
		}
		if (words.length + 1 > maxWords) {
			break;
		}
		words.push(segment);
		excerpt += segment + " ";
	}
	excerpt = excerpt.trim();

	if (excerpt.length < string.length) {
		excerpt = /[!.…?]$/.test(excerpt) ? excerpt : excerpt + " …";
	}
	return excerpt;
}

export function getFormFieldStringValue(formData: FormData, name: string) {
	let value = formData.get(name);
	if (value == null || typeof value !== "string") {
		return null;
	}
	return value;
}

export function bem(
	base: string,
	element?: string | null | undefined,
	...modifiers: (string | null | undefined)[]
) {
	let className = base;
	if (element) {
		className += `__${element}`;
	}
	for (let modifier of modifiers) {
		if (modifier) {
			className += `--${modifier}`;
		}
	}
	return className;
}

export function composeEventHandlers<
	EventType extends { defaultPrevented: boolean }
>(
	theirHandler: ((event: EventType) => any) | undefined,
	ourHandler: (event: EventType) => any
): (event: EventType) => any {
	return (event) => {
		theirHandler && theirHandler(event);
		if (!event.defaultPrevented) {
			return ourHandler(event);
		}
	};
}

export function getOwnerDocument<T extends Node>(
	element: T | null | undefined
) {
	if (!canUseDOM) {
		throw new Error(
			"getOwnerDocument can only be used in a browser environment"
		);
	}
	return element?.ownerDocument ?? document;
}

export function getOwnerWindow<T extends Element>(
	element: T | null | undefined
) {
	if (!canUseDOM) {
		throw new Error("getOwnerWindow can only be used in a browser environment");
	}
	let ownerDocument = getOwnerDocument(element);
	return ownerDocument.defaultView || window;
}

// MIT License, Copyright (c) Sindre Sorhus
// https://github.com/sindresorhus/email-regex/blob/main/index.js
export function emailRegex({ exact }: { exact?: boolean } = {}) {
	return exact ? new RegExp(`^${EMAIL_REGEX}$`) : new RegExp(EMAIL_REGEX, "g");
}

// MIT License, Copyright (c) Sindre Sorhus
// https://github.com/sindresorhus/is-email-like/blob/main/index.js
export function isEmailLike(string: string) {
	return emailRegex({ exact: true }).test(string);
}

export function isValidEmail(email: unknown): email is string {
	return typeof email === "string" && isEmailLike(email);
}

export function getFormDataStringValue(formData: FormData, fieldName: string) {
	let value = formData.get(fieldName);
	if (value == null || typeof value !== "string") {
		return null;
	}
	return value;
}
