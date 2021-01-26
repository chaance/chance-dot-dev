import * as React from "react";

const ClientOnly: React.FC<{
	children: React.ReactNode;
}> = function ClientOnly({ children }) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return mounted ? (children as React.ReactElement) : null;
};

export { ClientOnly };
