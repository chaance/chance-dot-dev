import { DateTime } from "luxon";

export function getFormattedDate(date: string, options?: { format?: string }) {
	const { format = "MMMM d, yyyy" } = options || {};
	return DateTime.fromISO(date).toFormat(format);
}
