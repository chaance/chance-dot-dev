import * as React from "react";
import { useLayoutEffect } from "~/lib/react/use-layout-effect";
import { useForceUpdate } from "~/lib/react/use-force-update";
import { createPortal } from "react-dom";

const PortalImpl: React.FC<PortalProps> = ({
	children,
	elementType = "chance-portal",
	mountRef,
}) => {
	let mountNode = React.useRef<HTMLDivElement | null>(null);
	let portalNode = React.useRef<HTMLElement | null>(null);
	let forceUpdate = useForceUpdate();

	// if (__DEV__) {
	// 	// eslint-disable-next-line react-hooks/rules-of-hooks
	// 	React.useEffect(() => {
	// 		if (mountRef != null) {
	// 			if (typeof mountRef !== "object" || !("current" in mountRef)) {
	// 				console.warn(
	// 					"@reach/portal: Invalid value passed to the `mountRef` of a " +
	// 						"`Portal`. The portal will be appended to the document body, but if " +
	// 						"you want to attach it to another DOM node you must pass a valid " +
	// 						"React ref object to `mountRef`."
	// 				);
	// 			} else if (mountRef.current == null) {
	// 				console.warn(
	// 					"@reach/portal: A ref was passed to the `mountRef` prop of a " +
	// 						"`Portal`, but no DOM node was attached to it. Be sure to pass the " +
	// 						"ref to a DOM component.\n\nIf you are forwarding the ref from " +
	// 						"another component, be sure to use the React.forwardRef API. " +
	// 						"See https://reactjs.org/docs/forwarding-refs.html."
	// 				);
	// 			}
	// 		}
	// 	}, [mountRef]);
	// }

	useLayoutEffect(() => {
		// This ref may be null when a hot-loader replaces components on the page
		if (!mountNode.current) return;
		// It's possible that the content of the portal has, itself, been portaled.
		// In that case, it's important to append to the correct document element.
		let ownerDocument = mountNode.current!.ownerDocument;
		let body = mountRef?.current || ownerDocument.body;
		portalNode.current = ownerDocument?.createElement(elementType)!;
		body.appendChild(portalNode.current);
		forceUpdate();
		return () => {
			if (portalNode.current && body) {
				body.removeChild(portalNode.current);
			}
		};
	}, [elementType, forceUpdate, mountRef]);

	return portalNode.current ? (
		createPortal(children, portalNode.current)
	) : (
		<span ref={mountNode} />
	);
};

const Portal: React.FC<PortalProps> = ({
	unstable_skipInitialRender,
	...props
}) => {
	let [hydrated, setHydrated] = React.useState(false);
	React.useEffect(() => {
		if (unstable_skipInitialRender) {
			setHydrated(true);
		}
	}, [unstable_skipInitialRender]);
	if (unstable_skipInitialRender && !hydrated) {
		return null;
	}
	return <PortalImpl {...props} />;
};

interface UsePortalOptions {
	/**
	 * The DOM element type to render.
	 */
	elementType?: string;
	/**
	 * The container ref to which the portal will be appended. If not set the
	 * portal will be appended to the body of the component's owner document
	 * (typically this is the `document.body`).
	 */
	mountRef?: React.RefObject<Node>;
	unstable_skipInitialRender?: boolean;
}

interface PortalProps extends UsePortalOptions {
	/**
	 * Regular React children.
	 */
	children?: React.ReactNode;
}

Portal.displayName = "Portal";

export type { PortalProps };
export { Portal };
