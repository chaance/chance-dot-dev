import cx from "clsx";
const ROOT_CLASS = "ui--card";

export function Card({
	children,
	removeBackground,
	removePadding,
	uncard,
	depth = "raised",
	roundedCorners,
}: CardProps) {
	return (
		<div
			className={cx(ROOT_CLASS, {
				[`${ROOT_CLASS}--depth-${depth}`]: typeof depth === "string",
				[`${ROOT_CLASS}--no-depth`]: depth === false,
				[`${ROOT_CLASS}--no-bg`]: removeBackground === true,
				[`${ROOT_CLASS}--no-bg:${removeBackground}`]:
					typeof removeBackground === "string",
				[`${ROOT_CLASS}--no-pad`]: removePadding === true,
				[`${ROOT_CLASS}--no-pad:${removePadding}`]:
					typeof removePadding === "string",
				[`${ROOT_CLASS}--uncard:${uncard}`]: uncard,
				[`${ROOT_CLASS}--rounded-corners-${
					roundedCorners === true ? "md" : roundedCorners
				}`]: roundedCorners,
			})}
		>
			<div className={`${ROOT_CLASS}__inner`}>{children}</div>
		</div>
	);
}

interface CardProps {
	children?: React.ReactNode;
	removePadding?: boolean | MQ;
	removeBackground?: boolean | MQ;
	roundedCorners?: boolean | "xs" | "sm" | "md" | "lg" | "xl";
	depth?: false | "raised";
	uncard?: MQ;
}

type MQ = "xs" | "sm" | "sm-down" | "md" | "md-down" | "lg" | "lg-down" | "xl";
