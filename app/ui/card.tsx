import cx from "clsx";
import styles from "./card.module.css";

export function Card({
	children,
	removeBackground,
	removePadding,
	uncard,
	depth = "raised",
	roundedCorners,
}: CardProps) {
	console.log(`uncard${capitalize(camelCase(uncard))}`);
	return (
		<div
			className={cx(styles.card, {
				[styles.depthRaised]: depth === "raised",
				[styles.noDepth]: depth === false,
				[styles.noBg]: removeBackground === true,
				[styles[`noBg${capitalize(camelCase(removeBackground))}`]]:
					typeof removeBackground === "string",
				[styles.noPad]: removePadding === true,
				[styles[`noPad${capitalize(camelCase(removePadding))}`]]:
					typeof removePadding === "string",
				[styles[`uncard${capitalize(camelCase(uncard))}`]]: uncard,
				[styles[`roundedCorners${capitalize(camelCase(roundedCorners))}`]]:
					roundedCorners,
			})}
		>
			<div className={styles.inner}>{children}</div>
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
