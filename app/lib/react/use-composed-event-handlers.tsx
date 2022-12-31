import { useCallback } from "react";
export function useComposedEventHandlers<
	EventType extends { defaultPrevented: boolean }
>(
	theirHandler: ((event: EventType) => any) | undefined,
	ourHandler: (event: EventType) => any
): (event: EventType) => any {
	return useCallback(
		(event) => {
			theirHandler && theirHandler(event);
			if (!event.defaultPrevented) {
				return ourHandler(event);
			}
		},
		[theirHandler, ourHandler]
	);
}
