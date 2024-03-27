import cx from "clsx";

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
			className={cx("card", {
				"card--depth-raised": depth === "raised",
				"card--no-depth": depth === false,
				"card--no-bg": removeBackground === true,
				[`${uncard}:card--no-bg`]: typeof removeBackground === "string",
				"card--no-pad": removePadding === true,
				[`${uncard}:card--no-pad`]: typeof removePadding === "string",
				[`${uncard}:card--uncard`]: typeof uncard === "string",
				[`card--rounded-corners-${roundedCorners}`]: roundedCorners,
			})}
		>
			<div className="card__inner">{children}</div>
		</div>
	);
}

function capitalize(str: any) {
	str = String(str);
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str: any) {
	return String(str).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
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
