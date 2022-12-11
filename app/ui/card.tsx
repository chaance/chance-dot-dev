import cx from "clsx";
const ROOT_CLASS = "ui--card";

export function Card({
	children,
	removeBackground,
	removePadding,
	depth = "raised",
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
			})}
		>
			<div className={`${ROOT_CLASS}__inner`}>{children}</div>
		</div>
	);
}

interface CardProps {
	children?: React.ReactNode;
	removePadding?:
		| boolean
		| "sm"
		| "sm-down"
		| "md"
		| "md-down"
		| "lg"
		| "lg-down"
		| "xl";
	removeBackground?:
		| boolean
		| "sm"
		| "sm-down"
		| "md"
		| "md-down"
		| "lg"
		| "lg-down"
		| "xl";
	depth?: false | "raised";
}
