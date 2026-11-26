export function getErrorMessageId(fieldId: string) {
	return `${fieldId}-error`;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
});

export function formatAdminDate(date: string | Date | null | undefined) {
	if (!date) {
		return "—";
	}
	return dateFormatter.format(typeof date === "string" ? new Date(date) : date);
}

export function getUserInitials(user: {
	email: string;
	nameFirst?: string | null;
	nameLast?: string | null;
}) {
	return user.nameFirst
		? user.nameFirst[0] + (user.nameLast?.[0] || user.nameFirst[1] || "")
		: user.email.slice(0, 2);
}
