import * as React from "react";
import { Box } from "$components/primitives/box";
// import kebabCase from "lodash/kebabCase";
import clsx from "clsx";

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

export function forwardRef<ComponentType extends As, Props = {}>(
	render: ForwardRefWithAsRenderFunction<ComponentType, Props>
): ForwardRefExoticComponentWithAs<
	ComponentType,
	Props
> /* & { displayName: string; } */ {
	const Comp: any = React.forwardRef(render);
	if (render.name) {
		Comp.displayName = render.name;
	}
	return Comp;
}

export function extendComponent<ComponentType extends As, Props = {}>(
	Comp: ComponentType,
	opts: ExtendCompOpts = {}
): ForwardRefExoticComponentWithAs<
	ComponentType,
	Omit<Props, "className"> &
		Omit<React.ComponentPropsWithoutRef<ComponentType>, "className"> & {
			className?: ExtendCompOpts["className"];
		}
> {
	const { className, displayName } = opts || {};
	const comp = forwardRef<ComponentType, any>(function (props, ref) {
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
	as?: any;
	displayName?: string;
};

export type AssignableRef<ValueType> =
	| {
			bivarianceHack(instance: ValueType | null): void;
	  }["bivarianceHack"]
	| React.MutableRefObject<ValueType | null>;

export type As<BaseProps = any> = React.ElementType<BaseProps>;

export type PropsWithAs<
	ComponentType extends As,
	ComponentProps
> = ComponentProps &
	Omit<
		React.ComponentPropsWithRef<ComponentType>,
		"as" | keyof ComponentProps
	> & {
		as?: ComponentType;
	};

export type PropsFromAs<
	ComponentType extends As,
	ComponentProps
> = (PropsWithAs<ComponentType, ComponentProps> & { as: ComponentType }) &
	PropsWithAs<ComponentType, ComponentProps>;

export interface FunctionComponentWithAs<
	ComponentType extends As,
	ComponentProps
> {
	/**
	 * Inherited from React.FunctionComponent with modifications to support `as`
	 */
	<TT extends As>(
		props: PropsWithAs<TT, ComponentProps>,
		context?: any
	): React.ReactElement<any, any> | null;
	(
		props: PropsWithAs<ComponentType, ComponentProps>,
		context?: any
	): React.ReactElement<any, any> | null;

	/**
	 * Inherited from React.FunctionComponent
	 */
	displayName?: string;
	propTypes?: React.WeakValidationMap<
		PropsWithAs<ComponentType, ComponentProps>
	>;
	contextTypes?: React.ValidationMap<any>;
	defaultProps?: Partial<PropsWithAs<ComponentType, ComponentProps>>;
}

export interface ExoticComponentWithAs<
	ComponentType extends As,
	ComponentProps
> {
	/**
	 * **NOTE**: Exotic components are not callable.
	 * Inherited from React.ExoticComponent with modifications to support `as`
	 */
	<TT extends As>(
		props: PropsWithAs<TT, ComponentProps>
	): React.ReactElement | null;
	(
		props: PropsWithAs<ComponentType, ComponentProps>
	): React.ReactElement | null;

	/**
	 * Inherited from React.ExoticComponent
	 */
	readonly $$typeof: symbol;
}

interface NamedExoticComponentWithAs<ComponentType extends As, ComponentProps>
	extends ExoticComponentWithAs<ComponentType, ComponentProps> {
	/**
	 * Inherited from React.NamedExoticComponent
	 */
	displayName?: string;
}

export interface ForwardRefExoticComponentWithAs<
	ComponentType extends As,
	ComponentProps
> extends NamedExoticComponentWithAs<ComponentType, ComponentProps> {
	/**
	 * Inherited from React.ForwardRefExoticComponent
	 * Will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
	 * but can be given its own specific name
	 */
	defaultProps?: Partial<PropsWithAs<ComponentType, ComponentProps>>;
	propTypes?: React.WeakValidationMap<
		PropsWithAs<ComponentType, ComponentProps>
	>;
}

export interface MemoExoticComponentWithAs<
	ComponentType extends As,
	ComponentProps
> extends NamedExoticComponentWithAs<ComponentType, ComponentProps> {
	readonly type: ComponentType extends React.ComponentType
		? ComponentType
		: FunctionComponentWithAs<ComponentType, ComponentProps>;
}

export interface ForwardRefWithAsRenderFunction<
	ComponentType extends As,
	ComponentProps = {}
> {
	(
		props: React.PropsWithChildren<PropsFromAs<ComponentType, ComponentProps>>,
		ref:
			| ((
					instance:
						| (ComponentType extends keyof ElementTagNameMap
								? ElementTagNameMap[ComponentType]
								: any)
						| null
			  ) => void)
			| React.MutableRefObject<
					| (ComponentType extends keyof ElementTagNameMap
							? ElementTagNameMap[ComponentType]
							: any)
					| null
			  >
			| null
	): React.ReactElement | null;
	displayName?: string;
	// explicit rejected with `never` required due to
	// https://github.com/microsoft/TypeScript/issues/36826
	/**
	 * defaultProps are not supported on render functions
	 */
	defaultProps?: never;
	/**
	 * propTypes are not supported on render functions
	 */
	propTypes?: never;
}

/**
 * This type is included in the DOM lib but is deprecated. It's still quite useful, so we want to
 * include it here and reference it when possible to avoid any issues when updating TS.
 */
export type ElementTagNameMap = HTMLElementTagNameMap &
	Pick<
		SVGElementTagNameMap,
		Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
	>;
