import type * as React from "react";
import { useCallback } from "react";
import { isFunction } from "~/lib/utils";

export function assignRef<T>(ref: React.Ref<T>, value: T) {
	if (isFunction(ref)) {
		ref(value);
	} else if (ref && "current" in ref) {
		// @ts-expect-error
		ref.current = value;
	}
}

export function useComposedRefs<T>(
	...refs: (
		| null
		| undefined
		| React.Ref<T | null | undefined>
		| ((instance: T | null | undefined) => void)
	)[]
) {
	return useCallback(
		(instance: T | null) => {
			for (let ref of refs) {
				if (ref) assignRef(ref, instance);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs
	);
}
