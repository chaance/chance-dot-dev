import "react-router";
declare module "react-router" {
	export type RedirectFunction = (
		url: string,
		init?: number | ResponseInit,
	) => never;
	export const redirect: RedirectFunction;
}
