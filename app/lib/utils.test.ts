import { isValidEmail } from "./utils";

test("isValidEmail returns false for non-emails", () => {
	expect(isValidEmail(undefined)).toBe(false);
	expect(isValidEmail(null)).toBe(false);
	expect(isValidEmail("")).toBe(false);
	expect(isValidEmail("not-an-email")).toBe(false);
	expect(isValidEmail("n@")).toBe(false);
});

test("isValidEmail returns true for emails", () => {
	expect(isValidEmail("kody@example.com")).toBe(true);
});
