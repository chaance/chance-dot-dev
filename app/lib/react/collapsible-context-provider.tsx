// Adapted from Radix UI Collapsible
// (c) WorkOS MIT License
import * as React from "react";
import { CollapsibleContext } from "./collapsible-context";

export interface CollapsibleProps {
	isOpen: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	isDisabled?: boolean;
	id?: string;
	children?:
		| React.ReactNode
		| ((props: {
				isOpen: boolean;
				onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
		  }) => React.ReactNode);
}

export function CollapsibleProvider(props: CollapsibleProps) {
	const { isOpen, isDisabled, onOpenChange, id: idProp, children } = props;
	let contentId = React.useId();
	if (idProp) {
		contentId = idProp;
	}

	return (
		<CollapsibleContext.Provider
			value={{
				contentId,
				isDisabled,
				isOpen,
				onOpenChange,
			}}
		>
			{typeof children === "function"
				? children({ isOpen, onOpenChange })
				: children}
		</CollapsibleContext.Provider>
	);
}
