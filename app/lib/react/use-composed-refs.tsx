import type * as React from "react";
import { useCallback } from "react";
import { isFunction } from "~/lib/utils";

export function useComposedRefs<T>(
	...refs: (
		| null
		| undefined
		| React.Ref<T | null | undefined>
		| ((instance: T | null | undefined) => void)
	)[]
) {
	return useCallback(
		(instance: T) => {
			refs.forEach((ref) => {
				if (isFunction(ref)) {
					ref(instance);
				} else if (ref) {
					(ref as React.MutableRefObject<T>).current = instance;
				}
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs
	);
}
