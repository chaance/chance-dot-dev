import * as React from "react";
import {
	Image as ImagePrimitive,
	ImageProps as ImagePrimitiveProps,
} from "src/components/primitives/image";
const styles = require("./image.module.scss");

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
	props,
	ref
) {
	return (
		<ImagePrimitive
			ref={ref}
			{...props}
			className={[styles.image, props.className]}
		/>
	);
});

type ImageProps = ImagePrimitiveProps;

export { Image };
export type { ImageProps };
