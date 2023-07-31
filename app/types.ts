export type ArrayOfKeys<T> = (keyof T)[];

export type ValueOf<T> = T[keyof T];

export type ExtendProps<T extends React.ElementType, P> = Omit<
	React.ComponentProps<T>,
	keyof P
> &
	P;

export type ExtendPropsWithRef<T extends React.ElementType, P> = Omit<
	React.ComponentPropsWithRef<T>,
	keyof P
> &
	P;

export type ElementTagNameMap = HTMLElementTagNameMap &
	Pick<
		SVGElementTagNameMap,
		Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
	>;
