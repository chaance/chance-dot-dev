import type { Session } from "react-router";
import { createCookieSessionStorage, redirect } from "react-router";
import { getUser, type User } from "~/models/user.server";
import { getRequiredServerEnvVar } from "~/lib/utils";
import { safeRedirect } from "./utils.server";

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 365;
export const USER_SESSION_KEY = "userId";

export const serverSessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__chance_dot_dev_session",
		secure: process.env.NODE_ENV === "production",
		secrets: [getRequiredServerEnvVar("SESSION_SECRET")],
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_EXPIRATION_TIME / 1000,
		httpOnly: true,
	},
});

export async function getSession(request: Request) {
	let cookie = request.headers.get("Cookie");
	return serverSessionStorage.getSession(cookie);
}

export async function getUserId(
	request: Request
): Promise<User["id"] | undefined> {
	let session = await getSession(request);
	let userId = session.get(USER_SESSION_KEY);
	return userId;
}

export async function getUserIdFromSession(
	session: Session
): Promise<User["id"] | undefined> {
	let userId = session.get(USER_SESSION_KEY);
	return userId;
}

export async function getSessionUser(request: Request) {
	let userId = await getUserId(request);
	if (userId == null) {
		return null;
	}
	let user = await getUser(userId);
	return user;
}

export async function getUserFromSession(session: Session) {
	let userId = await getUserIdFromSession(session);
	if (userId == null) {
		return null;
	}
	let user = await getUser(userId);
	return user;
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

export async function requireUser(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) {
	let userId = await requireUserId(request, redirectTo);
	let user = await getUser(userId);
	if (user) {
		return user;
	}
	throw await logout(request, redirectTo);
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
	return safeRedirect(redirectTo, "/", {
		headers: {
			"Set-Cookie": await serverSessionStorage.commitSession(session, {
				maxAge: remember
					? 60 * 60 * 24 * 7 // 7 days
					: undefined,
			}),
		},
	});
}

export async function logout(request: Request, redirectTo: string = "/") {
	let session = await getSession(request);
	return safeRedirect(redirectTo, "/", {
		headers: {
			"Set-Cookie": await serverSessionStorage.destroySession(session),
		},
	});
}
