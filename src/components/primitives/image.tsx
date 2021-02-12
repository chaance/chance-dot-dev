import * as React from "react";
import { cx } from "$lib/utils";
import { usePictureContext } from "src/components/primitives/picture";

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
	({ className, ...props }, ref) => {
		let context = usePictureContext();
		let alt = context?.alt || props.alt;
		let src = context?.src || props.src;
		return (
			<img
				ref={ref}
				{...props}
				className={className ? cx(className) : undefined}
				alt={alt}
				src={src}
			/>
		);
	}
);

Image.displayName = "Image";

export { Image };
export type { ImageOwnProps, ImageProps };

type ImageProps = Omit<
	React.ComponentPropsWithRef<"img">,
	keyof ImageOwnProps
> &
	ImageOwnProps;

interface ImageOwnProps {
	className?: import("clsx").ClassValue;
}
