import { useState, useCallback } from "react";
export function useForceUpdate() {
	let [, update] = useState<any>(Object.create(null));
	return useCallback(() => {
		update(Object.create(null));
	}, []);
}
