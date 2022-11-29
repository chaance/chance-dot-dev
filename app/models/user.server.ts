import type { User as DBUser, Profile as DBProfile } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "~/lib/db.server";
import { validatePassword } from "~/lib/utils";

export interface UserProfile {
	nameFirst: string | null;
	nameLast: string | null;
	avatarUrl: string | null;
}

export interface User extends UserProfile {
	id: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export async function getUser(id: string): Promise<User | null> {
	let user = await prisma.user.findUnique({
		where: { id },
		include: { profile: true },
	});
	return user ? modelUser(user) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
	let user = await prisma.user.findUnique({
		where: { email },
		include: { profile: true },
	});
	return user ? modelUser(user) : null;
}

export async function createUser(
	email: string,
	password: string,
	profile: UserProfile
): Promise<User> {
	let passwordErrors = validatePassword(password);
	if (passwordErrors.length > 0) {
		throw Error("Invalid password");
	}

	let hashedPassword = await hashPassword(password);
	let user = await prisma.user.create({
		data: {
			email,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
			profile: {
				create: profile,
			},
		},
		include: { profile: true },
	});
	return modelUser(user);
}

export async function deleteUser(id: string): Promise<User> {
	let deleted = await prisma.user.delete({
		where: { id },
		include: { profile: true },
	});
	return modelUser(deleted);
}

export async function updateUser(
	id: string,
	data: Partial<UserProfile> & { email?: string }
): Promise<User> {
	let { email, ...profileData } = data;
	let user = await prisma.user.update({
		where: { id },
		data: {
			email,
			profile: { update: profileData },
		},
		include: { profile: true },
	});
	return modelUser(user);
}

export async function updateUserPassword(
	email: string,
	password: string
): Promise<User> {
	let passwordErrors = validatePassword(password);
	if (passwordErrors.length > 0) {
		throw Error("Invalid password");
	}

	let hashedPassword = await hashPassword(password);

	let user = await prisma.user.update({
		where: { email },
		data: {
			password: {
				upsert: {
					create: {
						hash: hashedPassword,
					},
					update: {
						hash: hashedPassword,
					},
				},
			},
		},
		include: { profile: true },
	});
	return modelUser(user);
}

export async function verifyLogin(
	email: string,
	password: string
): Promise<User | null> {
	let userWithPassword = await prisma.user.findUnique({
		where: { email },
		include: {
			password: true,
			profile: true,
		},
	});

	if (!userWithPassword || !userWithPassword.password) {
		return null;
	}

	let isValid = await isValidPassword(password, userWithPassword.password.hash);
	if (!isValid) {
		return null;
	}

	let { password: _, ...userWithoutPassword } = userWithPassword;
	return modelUser(userWithoutPassword);
}

export function modelUser(
	user: (DBUser | User) & {
		profile: DBProfile | UserProfile | null;
	}
): User {
	if (!user.profile) {
		throw Error("profile required to model User");
	}
	return {
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		...modelUserProfile(user.profile),
	};
}

function modelUserProfile(profile: DBProfile | UserProfile): UserProfile {
	return {
		avatarUrl: profile.avatarUrl,
		nameFirst: profile.nameFirst,
		nameLast: profile.nameLast,
	};
}

async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

async function isValidPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}
