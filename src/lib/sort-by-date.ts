export function sortByLatestDate(dateA: Date | string, dateB: Date | string) {
	// @ts-ignore
	return new Date(dateB) - new Date(dateA);
}

export function sortByEarliestDate(dateA: Date | string, dateB: Date | string) {
	// @ts-ignore
	return new Date(dateA) - new Date(dateB);
}
