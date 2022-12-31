/**
 * An accessible dialog or "modal" window.
 *
 * @see WAI-ARIA https://www.w3.org/TR/wai-aria-practices-1.2/#dialog_modal
 */

import * as React from "react";
import { Portal } from "~/ui/primitives/portal";
import { getOwnerDocument } from "~/lib/utils";
import { useComposedRefs } from "~/lib/react/use-composed-refs";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { createContext } from "~/lib/react/create-context";
import { useRequiredContext } from "~/lib/react/use-required-context";
import { useComposedEventHandlers } from "~/lib/react/use-composed-event-handlers";
import type { ExtendPropsWithRef, ElementTagNameMap } from "~/types";

const noop = () => {};

type DialogUIState = "opening" | "open" | "closing" | "closed";

const DialogContext = createContext<DialogContextValue | null>(
	"DialogContext",
	null
);

function useDialogContext(component?: string) {
	return useRequiredContext(
		DialogContext,
		component
			? `${component} is missing a parent <Dialog /> component.`
			: `useDialogContext called outside of a <Dialog /> component.`
	);
}

type DismissDetails =
	| {
			trigger: "keyboard-escape";
			event: React.KeyboardEvent;
	  }
	| {
			trigger: "overlay-click";
			event: React.MouseEvent;
	  };

interface DialogState {
	open: boolean;
	dismiss(details: DismissDetails): void;
}

interface DialogContextValue {
	state: DialogState;
}

function useDialog({ open, onDismiss }: UseDialogOptions) {
	// We want to ignore the immediate focus of a tooltip so it doesn't pop
	// up again when the menu closes, only pops up when focus returns again
	// to the tooltip (like native OS tooltips).
	React.useEffect(() => {
		if (open) {
			// @ts-ignore
			window.__CHANCE_UI_DISABLE_TOOLTIPS = true;
		} else {
			window.requestAnimationFrame(() => {
				// Wait a frame so that this doesn't fire before tooltip does
				// @ts-ignore
				window.__CHANCE_UI_DISABLE_TOOLTIPS = false;
			});
		}
	}, [open]);

	let dismiss = React.useCallback(
		(details: DismissDetails) => {
			onDismiss?.(details);
		},
		[onDismiss]
	);

	return {
		state: React.useMemo(() => ({ open, dismiss }), [open, dismiss]),
	};
}

/**
 * Dialog
 */
const Dialog: React.FC<DialogProps> = ({
	children,
	portalElementType,
	portalMountRef,
	...props
}) => {
	let { state } = useDialog(props);
	return (
		<Portal
			data-ui-component="dialog"
			data-state={state.open ? "open" : "closed"}
			elementType={portalElementType}
			mountRef={portalMountRef}
		>
			<DialogContext.Provider value={{ state }}>
				{children}
			</DialogContext.Provider>
		</Portal>
	);
};
Dialog.displayName = "Dialog";

interface UseDialogOptions {
	/**
	 * Controls whether or not the dialog is open.
	 */
	open: boolean;
	/**
	 * Fires when the dialog is dismissed.
	 */
	onDismiss(details: DismissDetails): void;
}

interface DialogProps extends UseDialogOptions {
	children?: React.ReactNode;
	/**
	 * The DOM element type to be rendered by the dialog's portal.
	 */
	portalElementType?: string;
	/**
	 * The container ref to which the dialog's portal will be mounted. If not set
	 * the portal will be mounted to the body of the component's owner document
	 * (typically this is the `document.body`).
	 */
	portalMountRef?: React.RefObject<Node>;
}

function useDialogOverlay<E extends keyof JSX.IntrinsicElements>(
	{
		allowPinchZoom,
		dangerouslyBypassFocusLock,

		// TODO: Consider removing in favor of `lockScroll`, default to `true`.
		dangerouslyBypassScrollLock,
		initialFocusRef,
		onClick,
		onKeyDown,
		onMouseDown,
		unstable_lockFocusAcrossFrames,
		...props
	}: DialogOverlayProps<E>,
	state: DialogState,
	forwardedRef?: React.Ref<ElementFrom<E>> | null
) {
	let mouseDownTarget = React.useRef<EventTarget | null>(null);
	let overlayNode = React.useRef<Element | null>(null);
	let ref = useComposedRefs(overlayNode, forwardedRef);

	let activateFocusLock = React.useCallback(() => {
		if (initialFocusRef && initialFocusRef.current) {
			initialFocusRef.current.focus();
		}
	}, [initialFocusRef]);

	let { dismiss } = state;
	let handleClick = useComposedEventHandlers(
		onClick as any,
		React.useCallback(
			(event: React.MouseEvent<ElementFrom<E>>) => {
				if (mouseDownTarget.current === event.target) {
					event.stopPropagation();
					dismiss({ trigger: "overlay-click", event });
				}
			},
			[dismiss]
		)
	);

	let handleKeyDown = useComposedEventHandlers(
		onKeyDown as any,
		React.useCallback(
			(event: React.KeyboardEvent<ElementFrom<E>>) => {
				if (event.key === "Escape") {
					event.stopPropagation();
					dismiss({ trigger: "keyboard-escape", event });
				}
			},
			[dismiss]
		)
	);

	let handleMouseDown = useComposedEventHandlers(
		onMouseDown as any,
		React.useCallback((event: React.MouseEvent<ElementFrom<E>>) => {
			mouseDownTarget.current = event.target;
		}, [])
	);

	React.useEffect(() => {
		return overlayNode.current
			? createAriaHider(overlayNode.current)
			: void null;
	}, []);

	return {
		focusLockProps: {
			autoFocus: true,
			returnFocus: true,
			onActivation: activateFocusLock,
			disabled:
				dangerouslyBypassFocusLock != null
					? dangerouslyBypassFocusLock
					: !state.open,
			crossFrame: unstable_lockFocusAcrossFrames ?? true,
		},
		removeScrollProps: {
			allowPinchZoom,
			enabled:
				dangerouslyBypassScrollLock != null
					? !dangerouslyBypassScrollLock
					: state.open,
		},
		componentProps: {
			...props,
			ref,
			onClick: handleClick,
			onKeyDown: handleKeyDown,
			onMouseDown: handleMouseDown,
		},
		state,
	};
}

/**
 * DialogInner
 *
 * Low-level component if you need direct access to the portaled dialog wrapper.
 *
 * Note: Must be rendered inside of a `DialogWrapper`.
 */
const DialogOverlay = React.forwardRef<
	HTMLDivElement,
	DialogOverlayProps<"div">
>((props, forwardedRef) => {
	let { state } = useDialogContext("DialogOverlay");
	let { componentProps, focusLockProps, removeScrollProps } = useDialogOverlay(
		props,
		state,
		forwardedRef
	);
	return (
		<FocusLock {...focusLockProps}>
			<RemoveScroll {...removeScrollProps}>
				<div
					data-ui-component="dialog-overlay"
					data-state={state.open ? "open" : "closed"}
					{...componentProps}
				/>
			</RemoveScroll>
		</FocusLock>
	);
});
DialogOverlay.displayName = "DialogOverlay";

interface DialogOverlayOwnProps {
	children?: React.ReactNode;

	/**
	 * Handle zoom/pinch gestures on iOS devices when scroll locking is enabled.
	 * Defaults to `false`.
	 */
	allowPinchZoom?: boolean;
	/**
	 * By default the first focusable element will receive focus when the dialog
	 * opens but you can provide a ref to focus instead.
	 */
	initialFocusRef?: React.RefObject<any>;
	/**
	 * By default the dialog locks the focus inside it. Normally this is what you
	 * want. This prop is provided so that this feature can be disabled. This,
	 * however, is strongly discouraged.
	 *
	 * The reason it is provided is not to disable the focus lock entirely.
	 * Rather, there are certain situations where you may need more control on how
	 * the focus lock works. This should be complemented by setting up a focus
	 * lock yourself that would allow more flexibility for your specific use case.
	 *
	 * If you do set this prop to `true`, make sure you set up your own
	 * `FocusLock` component. You can likely use
	 * `react-focus-lock`, which is what Reach uses internally by default. It has
	 * various settings to allow more customization, but it takes care of a lot of
	 * hard work that you probably don't want or need to do.
	 *
	 * @see https://github.com/theKashey/react-focus-lock
	 * @see https://github.com/reach/reach-ui/issues/615
	 */
	dangerouslyBypassFocusLock?: boolean;
	/**
	 * By default, React Focus Lock prevents focus from being moved outside of the
	 * locked element even if the thing trying to take focus is in another frame.
	 * Normally this is what you want, as an iframe is typically going to be a
	 * part of your page content. But in some situations, like when using Code
	 * Sandbox, you can't use any of the controls or the editor in the sandbox
	 * while dialog is open because of the focus lock.
	 *
	 * This prop may have some negative side effects and unintended consequences,
	 * and it opens questions about how we might distinguish frames that *should*
	 * steal focus from those that shouldn't. Perhaps it's best for app devs to
	 * decide, and if they use this prop we should advise them to imperatively
	 * assign a -1 tabIndex to other iframes that are a part of the page content
	 * when the dialog is open.
	 *
	 * https://github.com/reach/reach-ui/issues/536
	 *
	 * @deprecated
	 */
	unstable_lockFocusAcrossFrames?: boolean;
	/**
	 * By default the dialog locks scrolling with `react-remove-scroll`, which
	 * also injects some styles on the body element to remove the scrollbar while
	 * maintaining its gap to prevent jank when the dialog's open state is
	 * toggled. This is almost always what you want in a dialog, but in some cases
	 * you may have the need to customize this behavior further.
	 *
	 * This prop will disable `react-remove-scroll` and allow you to compose your
	 * own scroll lock component to meet your needs. Like the
	 * `dangerouslyBypassFocusLock` prop, this is generally discouraged and should
	 * only be used if a proper fallback for managing scroll behavior is provided.
	 *
	 * @see https://github.com/theKashey/react-remove-scroll
	 */
	dangerouslyBypassScrollLock?: boolean;
}

type DialogOverlayProps<Elem extends keyof JSX.IntrinsicElements> =
	ExtendPropsWithRef<Elem, DialogOverlayOwnProps>;

function useDialogContent<E extends keyof JSX.IntrinsicElements>(
	props: DialogContentProps<E>,
	state: DialogState,
	forwardedRef?: React.Ref<ElementFrom<E>> | null
) {
	let handleClick = useComposedEventHandlers(
		props.onClick as any,
		React.useCallback((event: React.MouseEvent<ElementFrom<E>>) => {
			event.stopPropagation();
		}, [])
	);
	return {
		state,
		componentProps: {
			"aria-modal": true,
			role: "dialog",
			tabIndex: -1,
			...props,
			ref: forwardedRef,
			onClick: handleClick,
		},
	};
}

/**
 * DialogContent
 *
 * Low-level component if you need more control over the styles or rendering of
 * the dialog content.
 *
 * Note: Must be a child of `DialogOverlay`.
 *
 * Note: You only need to use this when you are also styling `DialogOverlay`,
 * otherwise you can use the high-level `Dialog` component and pass the props
 * to it. Any props passed to `Dialog` component (besides `isOpen` and
 * `onDismiss`) will be spread onto `DialogContent`.
 */
const DialogContent = React.forwardRef<
	HTMLDivElement,
	DialogContentProps<"div">
>(({ children, ...props }, forwardedRef) => {
	let { state } = useDialogContext("DialogContent");
	let { componentProps } = useDialogContent<"div">(props, state, forwardedRef);
	return (
		<div
			{...componentProps}
			data-ui-component="dialog-content"
			data-state={state.open ? "open" : "closed"}
		>
			{children}
		</div>
	);
});

interface DialogContentOwnProps {
	children?: React.ReactNode;
}

type DialogContentProps<E extends keyof JSX.IntrinsicElements = "div"> =
	ExtendPropsWithRef<E, DialogContentOwnProps>;

DialogContent.displayName = "DialogContent";

function createAriaHider(dialogNode: Element) {
	let originalValues: any[] = [];
	let rootNodes: Element[] = [];
	let ownerDocument = getOwnerDocument(dialogNode)!;
	if (!dialogNode) {
		console.warn(
			"A ref has not yet been attached to a dialog node when attempting to call `createAriaHider`."
		);
		return noop;
	}

	Array.prototype.forEach.call(
		ownerDocument.querySelectorAll("body > *"),
		(node) => {
			const portalNode = dialogNode.parentNode?.parentNode?.parentNode;
			if (node === portalNode) {
				return;
			}
			let attr = node.getAttribute("aria-hidden");
			let alreadyHidden = attr !== null && attr !== "false";
			if (alreadyHidden) {
				return;
			}
			originalValues.push(attr);
			rootNodes.push(node);
			node.setAttribute("aria-hidden", "true");
		}
	);

	return () => {
		rootNodes.forEach((node, index) => {
			let originalValue = originalValues[index];
			if (originalValue === null) {
				node.removeAttribute("aria-hidden");
			} else {
				node.setAttribute("aria-hidden", originalValue);
			}
		});
	};
}

export type {
	DialogProps,
	DialogContentProps,
	DialogOverlayProps,
	DialogUIState,
};
export { Dialog, DialogContent, DialogOverlay };

type ElementFrom<E> = E extends keyof ElementTagNameMap
	? ElementTagNameMap[E]
	: never;
