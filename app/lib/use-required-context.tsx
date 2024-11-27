import { useContext, type Context } from "react";

export function useRequiredContext<T>(
	ctx:
		| Context<T | null>
		| Context<T | undefined>
		| Context<T | null | undefined>,
	errorMessage: string,
): NonNullable<T> {
	let context = useContext(ctx as Context<T | null | undefined>);
	if (context == null) {
		let error = new Error(errorMessage);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(error, useRequiredContext);
		}
		throw error;
	}
	return context;
}
