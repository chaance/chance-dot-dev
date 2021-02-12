import * as React from "react";
import { cx } from "$lib/utils";

const PictureContext = React.createContext<PictureContextValue | null>(null);
PictureContext.displayName = "PictureContext";

const Picture = React.forwardRef<HTMLPictureElement, PictureProps>(
	({ alt, src, srcSet = [], className, children, ...props }, ref) => {
		return (
			<picture
				ref={ref}
				{...props}
				className={className ? cx(className) : undefined}
			>
				{srcSet.map((src, i) => (
					<source {...src} key={i} />
				))}
				<PictureContext.Provider value={{ alt, src, srcSet }}>
					{children}
				</PictureContext.Provider>
			</picture>
		);
	}
);

Picture.displayName = "Picture";

function usePictureContext() {
	return React.useContext(PictureContext);
}

export { Picture, usePictureContext };
export type { PictureOwnProps, PictureProps };

interface PictureContextValue {
	alt: string;
	src: string;
	srcSet: SrcSet[];
}

interface SrcSet {
	media: string;
	src?: string;
	srcSet?: string;
	type?: string;
}

type PictureProps = Omit<
	React.ComponentPropsWithRef<"picture">,
	keyof PictureOwnProps
> &
	PictureOwnProps;

interface PictureOwnProps {
	className?: import("clsx").ClassValue;
	alt: string;
	src: string;
	srcSet?: SrcSet[];
}
