"use client";

import * as React from "react";
import { isRouteErrorResponse } from "react-router";
import { canUseDOM } from "./utils";

export function RouteErrorLogger({
	error,
	boundaryName,
}: {
	error: unknown;
	boundaryName: string;
}) {
	if (import.meta.env.DEV) {
		useRouteErrorLogger(error, boundaryName);
	}

	return null;
}

function useRouteErrorLogger(error: unknown, boundaryName: string) {
	if (!canUseDOM) {
		logRouteError(error, boundaryName);
	}

	const errorRef = React.useRef(error);
	const nameRef = React.useRef(boundaryName);

	React.useEffect(() => {
		const previousError = errorRef.current;
		const previousName = nameRef.current;
		errorRef.current = error;
		nameRef.current = boundaryName;

		if (error !== previousError || boundaryName !== previousName) {
			logRouteError(error, boundaryName);
		}
	}, [error, boundaryName]);
}

function logRouteError(error: unknown, boundaryName: string) {
	let label = `[${boundaryName} error boundary]`;
	if (isRouteErrorResponse(error)) {
		console.error(
			`${label} ${error.status} ${error.statusText}`.trim(),
			error.data ?? "",
		);
	} else {
		console.error(label, error);
	}
}
