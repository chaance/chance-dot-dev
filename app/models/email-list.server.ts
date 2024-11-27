import type {
	EmailSubscriber as DBEmailSubscriber,
	EmailList as DBEmailList,
} from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { isValidEmail } from "~/lib/utils";

export interface EmailList {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface EmailListWithSubscribers extends EmailList {
	subscribers: EmailSubscriber[];
}

export interface EmailSubscriber {
	id: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
	nameFirst: string | null;
	nameLast: string | null;
}

export interface EmailSubscriberWithLists extends EmailSubscriber {
	lists: EmailList[];
}

export async function getAllSubscribers(): Promise<EmailSubscriber[]> {
	let records = await prisma.emailSubscriber.findMany();
	return records.map(modelEmailSubscriber);
}

export async function getAllEmailLists(): Promise<EmailList[]> {
	let records = await prisma.emailList.findMany();
	return records.map(modelEmailList);
}

export async function getEmailList(
	id: string,
	include?: { subscribers: false },
): Promise<EmailList | null>;
export async function getEmailList(
	id: string,
	include: { subscribers: true },
): Promise<EmailListWithSubscribers | null>;

export async function getEmailList(
	id: string,
	include?: { subscribers: boolean },
): Promise<EmailList | EmailListWithSubscribers | null> {
	let record = await prisma.emailList.findFirst({
		where: { id },
		include: include?.subscribers ? { subscribers: true } : undefined,
	});
	return record
		? include?.subscribers
			? modelEmailListWithSubscribers(record as any)
			: modelEmailList(record)
		: null;
}

export async function getSubscriber(
	id: string,
	include?: { lists: false },
): Promise<EmailSubscriber | null>;
export async function getSubscriber(
	id: string,
	include: { lists: true },
): Promise<EmailSubscriberWithLists | null>;

export async function getSubscriber(
	id: string,
	include?: { lists: boolean },
): Promise<EmailSubscriber | EmailSubscriberWithLists | null> {
	let record = await prisma.emailSubscriber.findFirst({
		where: { id },
		include: include?.lists ? { lists: true } : undefined,
	});
	return record
		? include?.lists
			? modelEmailSubscriberWithLists(record as any)
			: modelEmailSubscriber(record)
		: null;
}

export async function createEmailList({
	name,
}: {
	name: string;
}): Promise<EmailList>;
export async function createEmailList({
	name,
}: {
	name: string;
	subscribers: Array<{
		email: string;
		nameFirst?: string | null | undefined;
		nameLast?: string | null | undefined;
	}>;
}): Promise<EmailListWithSubscribers>;

export async function createEmailList({
	name,
	subscribers,
}: {
	name: string;
	subscribers?: Array<{
		email: string;
		nameFirst?: string | null | undefined;
		nameLast?: string | null | undefined;
	}>;
}): Promise<EmailList | EmailListWithSubscribers> {
	let record = await prisma.emailList.create({
		data: {
			name,
			subscribers: subscribers
				? {
						connectOrCreate: subscribers.map((subscriber) => {
							if (!isValidEmail(subscriber.email)) {
								throw new Error("Invalid email address");
							}

							return {
								create: {
									email: subscriber.email,
									nameFirst: subscriber.nameFirst,
									nameLast: subscriber.nameLast,
								},
								where: { email: subscriber.email },
							};
						}),
					}
				: undefined,
		},
		include: subscribers ? { subscribers: true } : undefined,
	});
	return subscribers
		? modelEmailListWithSubscribers(record as any)
		: modelEmailList(record);
}

export async function createSubscriber(data: {
	email: string;
	nameFirst?: string | null;
	nameLast?: string | null;
}): Promise<EmailSubscriber>;
export async function createSubscriber(data: {
	email: string;
	nameFirst?: string | null;
	nameLast?: string | null;
	lists: Array<{ name: string }>;
}): Promise<EmailSubscriberWithLists>;

export async function createSubscriber({
	email,
	nameFirst,
	nameLast,
	lists,
}: {
	email: string;
	nameFirst?: string | null;
	nameLast?: string | null;
	lists?: Array<{ name: string }>;
}): Promise<EmailSubscriber | EmailSubscriberWithLists> {
	if (!isValidEmail(email)) {
		throw new Error("Invalid email address");
	}
	let record = await prisma.emailSubscriber.create({
		data: {
			email,
			nameFirst,
			nameLast,
			lists: lists
				? {
						connectOrCreate: lists.map((list) => {
							return {
								create: {
									name: list.name,
								},
								where: { name: list.name },
							};
						}),
					}
				: undefined,
		},
		include: lists ? { lists: true } : undefined,
	});
	return lists
		? modelEmailSubscriberWithLists(record as any)
		: modelEmailSubscriber(record);
}

export async function updateEmailList(
	id: string,
	{ name }: { name?: string },
): Promise<EmailList> {
	let record = await prisma.emailList.update({
		where: { id },
		data: { name: name || undefined },
	});
	return modelEmailList(record);
}

export async function updateSubscriber(
	id: string,
	data: {
		email?: string | null;
		nameFirst?: string | null;
		nameLast?: string | null;
	},
): Promise<EmailSubscriber>;
export async function updateSubscriber(
	id: string,
	data: {
		email?: string | null;
		nameFirst?: string | null;
		nameLast?: string | null;
		lists: string[];
	},
): Promise<EmailSubscriberWithLists>;

export async function updateSubscriber(
	id: string,
	{
		email,
		nameFirst,
		nameLast,
		lists,
	}: {
		email?: string | null;
		nameFirst?: string | null;
		nameLast?: string | null;
		lists?: string[];
	},
): Promise<EmailSubscriber | EmailSubscriberWithLists> {
	if (!isValidEmail(email)) {
		throw new Error("Invalid email address");
	}
	let record = await prisma.emailSubscriber.update({
		where: { id },
		data: {
			email: email || undefined,
			nameFirst,
			nameLast,
			lists: lists ? { set: lists.map((id) => ({ id })) } : undefined,
		},
		include: lists ? { lists: true } : undefined,
	});
	return lists
		? modelEmailSubscriberWithLists(record as any)
		: modelEmailSubscriber(record);
}

export async function setEmailListSubscribers(
	id: string,
	subscribers: string[],
): Promise<EmailListWithSubscribers> {
	let record = await prisma.emailList.update({
		where: { id },
		data: {
			subscribers: {
				set: subscribers.map((id) => ({ id })),
			},
		},
		include: { subscribers: true },
	});
	return modelEmailListWithSubscribers(record);
}

export async function removeEmailListSubscribers(
	id: string,
	subscribers: string[],
): Promise<EmailListWithSubscribers> {
	let record = await prisma.emailList.update({
		where: { id },
		data: {
			subscribers: {
				disconnect: subscribers.map((id) => ({ id })),
			},
		},
		include: { subscribers: true },
	});
	return modelEmailListWithSubscribers(record);
}

export async function addEmailListSubscribers(
	id: string,
	subscribers: string[],
): Promise<EmailListWithSubscribers> {
	let record = await prisma.emailList.update({
		where: { id },
		data: {
			subscribers: {
				connect: subscribers.map((id) => ({ id })),
			},
		},
		include: { subscribers: true },
	});
	return modelEmailListWithSubscribers(record);
}

export async function addSubscriberToLists(
	id: string,
	lists: string[],
): Promise<EmailSubscriberWithLists> {
	let record = await prisma.emailSubscriber.update({
		where: { id },
		data: {
			lists: {
				connect: lists.map((id) => ({ id })),
			},
		},
		include: { lists: true },
	});
	return modelEmailSubscriberWithLists(record);
}

export async function removeSubscriberFromLists(
	id: string,
	lists: string[],
): Promise<EmailSubscriberWithLists> {
	let record = await prisma.emailSubscriber.update({
		where: { id },
		data: {
			lists: {
				disconnect: lists.map((id) => ({ id })),
			},
		},
		include: { lists: true },
	});
	return modelEmailSubscriberWithLists(record);
}

export async function setSubscriberLists(
	id: string,
	lists: string[],
): Promise<EmailSubscriberWithLists> {
	let record = await prisma.emailSubscriber.update({
		where: { id },
		data: {
			lists: {
				set: lists.map((id) => ({ id })),
			},
		},
		include: { lists: true },
	});
	return modelEmailSubscriberWithLists(record);
}

export async function deleteEmailList(id: string) {
	let record = await prisma.emailList.delete({
		where: { id },
	});
	return modelEmailList(record);
}

export async function deleteSubscriber(id: string) {
	let record = await prisma.emailSubscriber.delete({
		where: { id },
	});
	return modelEmailSubscriber(record);
}

export function modelEmailListWithSubscribers(
	record: DBEmailList & { subscribers: DBEmailSubscriber[] },
): EmailListWithSubscribers {
	return {
		...modelEmailList(record),
		subscribers: record.subscribers.map(modelEmailSubscriber),
	};
}

export function modelEmailList(record: DBEmailList): EmailList {
	return {
		id: record.id,
		name: record.name,
		updatedAt: record.updatedAt,
		createdAt: record.createdAt,
	};
}

export function modelEmailSubscriberWithLists(
	record: DBEmailSubscriber & { lists: DBEmailList[] },
): EmailSubscriberWithLists {
	return {
		...modelEmailSubscriber(record),
		lists: record.lists.map(modelEmailList),
	};
}

export function modelEmailSubscriber(
	record: DBEmailSubscriber,
): EmailSubscriber {
	return {
		id: record.id,
		email: record.email,
		updatedAt: record.updatedAt,
		createdAt: record.createdAt,
		nameFirst: record.nameFirst,
		nameLast: record.nameLast,
	};
}
