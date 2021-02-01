import * as React from "react";
import { Box, BoxProps } from "$components/primitives/box";

// import kebabCase from "lodash/kebabCase";
import clsx from "clsx";

export function fromArray<T>(value: T | T[]): T {
	return Array.isArray(value) ? value[0] : value;
}

export function canUseDOM() {
	return (
		typeof window !== "undefined" &&
		typeof window.document !== "undefined" &&
		typeof window.document.createElement !== "undefined"
	);
}

export const useIsomorphicLayoutEffect = canUseDOM()
	? React.useLayoutEffect
	: React.useEffect;

export function formatReadingTime(minutes: string | number) {
	return `${minutes} minute read`;
}

export function formatListenTime(minutes: string | number) {
	return `${minutes} minute listen`;
}

export function unSlashIt(str: string) {
	return str.replace(/^(\/*)|(\/*)$/g, "");
}

export function leadingSlashIt(str: string) {
	return "/" + unSlashIt(str);
}

export function trailingSlashIt(str: string) {
	return unSlashIt(str) + "/";
}

export function doubleSlashIt(str: string) {
	return "/" + unSlashIt(str) + "/";
}

export function assignRef<RefValueType = any>(
	ref: AssignableRef<RefValueType> | null | undefined,
	value: RefValueType
) {
	if (ref == null) {
		return;
	}
	if (typeof ref === "function") {
		ref(value);
	} else {
		try {
			ref.current = value;
		} catch (error) {
			throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
		}
	}
}

export function composeRefs<RefValueType = any>(
	refs: (AssignableRef<RefValueType> | null | undefined)[],
	value: RefValueType
) {
	refs.forEach((ref) => assignRef(ref, value));
}

export function extendComponent<T extends React.ElementType>(
	Comp: T,
	opts: ExtendCompOpts = {}
) {
	const { className, displayName } = opts || {};
	const comp = React.forwardRef<React.ComponentType<T>, BoxProps<T>>(function (
		props,
		ref
	) {
		return (
			<Box
				as={Comp}
				ref={ref}
				{...props}
				className={[props.className, className]}
			/>
		);
	});
	if (displayName) {
		comp.displayName = displayName;
	} else if ((Comp as any).displayName) {
		comp.displayName = (Comp as any).displayName;
	}
	return comp;
}

export { clsx as cx };

type ExtendCompOpts = {
	className?: import("clsx").ClassValue;
	displayName?: string;
};

export type AssignableRef<ValueType> =
	| {
			bivarianceHack(instance: ValueType | null): void;
	  }["bivarianceHack"]
	| React.MutableRefObject<ValueType | null>;

/**
 * This type is included in the DOM lib but is deprecated. It's still quite useful, so we want to
 * include it here and reference it when possible to avoid any issues when updating TS.
 */
export type ElementTagNameMap = HTMLElementTagNameMap &
	Pick<
		SVGElementTagNameMap,
		Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
	>;
