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
