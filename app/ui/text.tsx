import * as React from "react";
import * as Primitives from "~/ui/primitives/heading";
import cx from "clsx";

const BASE_CLASS = "ui--text";

type As =
	| "div"
	| "span"
	| "p"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "Heading"
	| "legend"
	| "dfn"
	| "li"
	| "dt"
	| "dd"
	| "label";

interface TextQualities {
	variant?:
		| "heading-title"
		| `heading-${1 | 2 | 3 | 4 | 5 | 6}`
		| "body"
		| "body-sm"
		| "body-md"
		| "body-lg";
	color?:
		| "success"
		| "critical"
		| "warning"
		| "weak"
		| "weaker"
		| "weakest"
		| "text";
	weight?: "bold" | "semibold" | "regular";
	alignment?: "start" | "center" | "end";
	wordBreak?: "normal" | "break-all" | "break-word" | "keep-all";
	transform?: "uppercase" | "lowercase" | "capitalize" | "none";
}

interface TextProps extends TextQualities {
	as?: As;
	truncate?: boolean;
	noWrap?: boolean;
	id?: string;
	htmlFor?: string;
	children?: React.ReactNode;
	role?: "alert" | "status";
	"aria-hidden"?: boolean;
	"aria-live"?: "polite" | "assertive" | "off";
	"aria-atomic"?: boolean;
}

const TextGroupContext = React.createContext<Partial<TextQualities> | null>(
	null
);
TextGroupContext.displayName = "TextGroupContext";

function useTextGroupContext() {
	return React.useContext(TextGroupContext);
}

interface TextGroupProps extends Partial<TextQualities> {
	children: React.ReactNode;
}

interface TextProseProps extends TextGroupProps {
	ref?: React.Ref<HTMLDivElement>;
}

function TextGroup({ children, ...ctx }: TextGroupProps) {
	return (
		<TextGroupContext.Provider value={ctx}>
			{children}
		</TextGroupContext.Provider>
	);
}

const TextProse = React.forwardRef<HTMLDivElement, TextProseProps>(
	({ children, ...props }, ref) => {
		return (
			<div
				className={cx(
					`${BASE_CLASS}-prose`,
					getTextQualityClassNames(`${BASE_CLASS}-prose`, props)
				)}
				ref={ref}
			>
				{children}
			</div>
		);
	}
);
TextProse.displayName = "TextProse";

const Text = React.forwardRef<HTMLElement, TextProps>(
	(
		{ as = "p", truncate, noWrap, id, children, htmlFor, ...props },
		forwardedRef
	) => {
		let Comp: any = as === "Heading" ? Primitives.Heading : as;
		let ctx = useTextGroupContext();
		let {
			variant = ctx?.variant,
			color = ctx?.color,
			weight = ctx?.weight,
			alignment = ctx?.alignment,
			wordBreak = ctx?.wordBreak,
			transform = ctx?.transform,
		} = props;

		const ariaProps = filterAriaProps(props);

		return (
			<Comp
				ref={forwardedRef}
				className={cx(
					BASE_CLASS,
					getTextQualityClassNames(BASE_CLASS, {
						variant,
						color,
						weight,
						alignment,
						wordBreak,
						transform,
					}),
					{
						[`${BASE_CLASS}--truncate`]: truncate,
						[`${BASE_CLASS}--no-wrap`]: noWrap,
					}
				)}
				id={id}
				htmlFor={htmlFor}
				{...ariaProps}
			>
				{children}
			</Comp>
		);
	}
);
Text.displayName = "Text";

const TextParagraph = React.forwardRef<
	HTMLParagraphElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="p" ref={forwardedRef} {...props} />;
});
TextParagraph.displayName = "TextParagraph";

const TextListItem = React.forwardRef<
	HTMLLIElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="li" ref={forwardedRef} {...props} />;
});
TextListItem.displayName = "TextListItem";

const TextHeading = React.forwardRef<
	HTMLHeadingElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="Heading" ref={forwardedRef} {...props} />;
});
TextHeading.displayName = "TextHeading";

const TextLegend = React.forwardRef<
	HTMLHeadingElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="legend" ref={forwardedRef} {...props} />;
});
TextLegend.displayName = "TextLegend";

const TextDiv = React.forwardRef<
	HTMLDivElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="div" ref={forwardedRef} {...props} />;
});
TextDiv.displayName = "TextDiv";

const TextSpan = React.forwardRef<
	HTMLSpanElement,
	Omit<TextProps, "as" | "htmlFor">
>((props, forwardedRef) => {
	return <Text as="span" ref={forwardedRef} {...props} />;
});
TextSpan.displayName = "TextSpan";

const TextLabel = React.forwardRef<HTMLLabelElement, Omit<TextProps, "as">>(
	(props, forwardedRef) => {
		return <Text as="label" ref={forwardedRef} {...props} />;
	}
);
TextLabel.displayName = "TextLabel";

function getTextQualityClassNames(
	baseClass: string,
	{
		variant,
		color,
		weight,
		alignment,
		wordBreak,
		transform,
	}: Partial<TextQualities>
) {
	return cx({
		[`${baseClass}--${variant}`]: variant,
		[`${baseClass}--${color}`]: color && color !== "text",
		[`${baseClass}--color-text`]: color === "text",
		[`${baseClass}--${weight}`]: weight && weight !== "regular",
		[`${baseClass}--weight-${weight}`]: weight === "regular",
		[`${baseClass}--${alignment}`]: alignment,
		[`${baseClass}--${wordBreak}`]: wordBreak && wordBreak !== "normal",
		[`${baseClass}--break-normal`]: wordBreak === "normal",
		[`${baseClass}--${transform}`]: transform && transform !== "none",
		[`${baseClass}--transform-none`]: transform === "none",
	});
}

export {
	Text,
	TextGroup,
	TextProse,
	useTextGroupContext,
	TextParagraph,
	TextListItem,
	TextHeading,
	TextLegend,
	TextDiv,
	TextSpan,
	TextLabel,
};

function filterAriaProps<Props extends Record<string, any>>(props: Props) {
	let ariaProps = {} as Pick<Props, keyof Props & `aria-${string}`>;
	for (let key in props) {
		if (key.startsWith("aria-")) {
			// @ts-expect-error
			ariaProps[key] = props[key];
		}
	}
	return ariaProps;
}
