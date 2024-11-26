import { HydratedRouter } from "react-router/dom";
import * as React from "react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
	React.startTransition(() => {
		hydrateRoot(
			document,
			<React.StrictMode>
				<HydratedRouter />
			</React.StrictMode>
		);
	});
}

if (window.requestIdleCallback) {
	window.requestIdleCallback(hydrate);
} else {
	// Safari doesn't support requestIdleCallback
	// https://caniuse.com/requestidlecallback
	window.setTimeout(hydrate, 1);
}
