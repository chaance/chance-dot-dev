import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { getRequiredServerEnvVar } from "~/lib/utils";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const sessionExpirationTime = 1000 * 60 * 60 * 24 * 365;

export const serverSessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__chance_dot_dev_session",
		secure: process.env.NODE_ENV === "production",
		secrets: [getRequiredServerEnvVar("SESSION_SECRET")],
		sameSite: "lax",
		path: "/",
		maxAge: sessionExpirationTime / 1000,
		httpOnly: true,
	},
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
	const cookie = request.headers.get("Cookie");
	return serverSessionStorage.getSession(cookie);
}

export async function getUserId(
	request: Request
): Promise<User["id"] | undefined> {
	let session = await getSession(request);
	let userId = session.get(USER_SESSION_KEY);
	return userId;
}

export async function getUser(request: Request) {
	let userId = await getUserId(request);
	if (userId === undefined) {
		return null;
	}

	let user = await getUserById(userId);
	if (user) {
		return user;
	}

	throw await logout(request);
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) {
	let userId = await getUserId(request);
	if (!userId) {
		let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
}

export async function requireUser(request: Request) {
	let userId = await requireUserId(request);
	let user = await getUserById(userId);
	if (user) {
		return user;
	}

	throw await logout(request);
}

export async function createUserSession({
	request,
	userId,
	remember,
	redirectTo,
}: {
	request: Request;
	userId: string;
	remember: boolean;
	redirectTo: string;
}) {
	let session = await getSession(request);
	session.set(USER_SESSION_KEY, userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await serverSessionStorage.commitSession(session, {
				maxAge: remember
					? 60 * 60 * 24 * 7 // 7 days
					: undefined,
			}),
		},
	});
}

export async function logout(request: Request) {
	let session = await getSession(request);
	return redirect("/", {
		headers: {
			"Set-Cookie": await serverSessionStorage.destroySession(session),
		},
	});
}
