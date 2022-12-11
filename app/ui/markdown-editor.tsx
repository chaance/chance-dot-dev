// Copyright (c) 2021 Andrii Los, MIT License
// https://github.com/RIP21/react-simplemde-editor/blob/master/src/SimpleMdeReact.tsx
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { Options } from "easymde";
import type SimpleMDE from "easymde";
import type { Editor, EditorEventMap, KeyMap, Position } from "codemirror";
import type { EditorChange } from "codemirror";
import cx from "clsx";

const ROOT_CLASS = "cs--markdown-editor";

export type DOMEvent =
	| "mousedown"
	| "dblclick"
	| "touchstart"
	| "contextmenu"
	| "keydown"
	| "keypress"
	| "keyup"
	| "cut"
	| "copy"
	| "paste"
	| "dragstart"
	| "dragenter"
	| "dragover"
	| "dragleave"
	| "drop";

export type CopyEvents = {
	[TKey in string &
		DOMEvent &
		keyof DocumentAndElementEventHandlersEventMap as `${TKey}`]?: (
		instance: Editor,
		event: DocumentAndElementEventHandlersEventMap[TKey]
	) => void;
};

export type GlobalEvents = {
	[TKey in string &
		DOMEvent &
		keyof GlobalEventHandlersEventMap as `${TKey}`]?: (
		instance: Editor,
		event: GlobalEventHandlersEventMap[TKey]
	) => void;
};

export type DefaultEvent = (instance: Editor, ...args: any[]) => void;

export type IndexEventsSignature = {
	[key: string]: DefaultEvent | undefined;
};

export interface SimpleMdeToCodemirrorEvents
	extends CopyEvents,
		GlobalEvents,
		IndexEventsSignature,
		Partial<EditorEventMap> {}

type GetMdeInstance = (instance: SimpleMDE) => void;
type GetCodemirrorInstance = (instance: Editor) => void;
type GetLineAndCursor = (instance: Position) => void;

interface MarkdownEditorProps
	extends Omit<React.ComponentPropsWithRef<"div">, "onChange"> {
	fieldId?: string;
	onChange?: (value: string, changeObject?: EditorChange) => void;
	value?: string;
	defaultValue?: string;
	extraKeys?: KeyMap;
	options?: SimpleMDE.Options;
	events?: SimpleMdeToCodemirrorEvents;
	getMdeInstance?: GetMdeInstance;
	getCodemirrorInstance?: GetCodemirrorInstance;
	getLineAndCursor?: GetLineAndCursor;
}

interface MarkdownEditorTextareaProps
	extends Omit<
		React.ComponentPropsWithRef<"textarea">,
		"id" | "value" | "defaultValue"
	> {}

const MarkdownEditorContext =
	React.createContext<MarkdownEditorContextValue | null>(null);
MarkdownEditorContext.displayName = "MarkdownEditorContext";

interface MarkdownEditorContextValue {
	fieldId: string;
	setTextRef(node: HTMLTextAreaElement | null): void;
	value: string | undefined;
	defaultValue: string | undefined;
}

function useMarkdownEditorContext() {
	let context = React.useContext(MarkdownEditorContext);
	if (context == null) {
		throw new Error(
			"useMarkdownEditorContext must be used within a MarkdownEditor"
		);
	}
	return context;
}

const MarkdownEditor = React.forwardRef<HTMLDivElement, MarkdownEditorProps>(
	(props, ref) => {
		let {
			events,
			defaultValue,
			value,
			options = {},
			children,
			extraKeys,
			getLineAndCursor,
			getMdeInstance,
			getCodemirrorInstance,
			onChange,
			fieldId: _fieldId,
			...rest
		} = props;

		let generatedFieldId = React.useId();
		let fieldId = _fieldId != null ? _fieldId : generatedFieldId;

		let elementWrapperRef = useRef<HTMLDivElement | null>(null);
		let nonEventChangeRef = useRef<boolean>(true);

		let [textareaElement, setTextareaElement] =
			useState<HTMLTextAreaElement | null>(null);

		let { current: isControlled } = useRef<boolean>(value !== undefined);
		let initialValue = isControlled ? value : defaultValue;

		let [editorInstance, setEditorInstance] = useState<SimpleMDE | null>(null);

		let { imageUploadFunction } = options || {};
		let imageUploadCallback = useCallback(
			(
				file: File,
				onSuccess: (url: string) => void,
				onError: (error: string) => void
			) => {
				if (imageUploadFunction) {
					imageUploadFunction(file, (url: string) => onSuccess(url), onError);
				}
			},
			[imageUploadFunction]
		);

		useEffect(() => {
			let editor: SimpleMDE;
			let isCurrent = true;
			if (textareaElement) {
				let initialOptions: Options = {
					element: textareaElement,
				};
				if (initialValue != null) {
					initialOptions.initialValue = initialValue;
				}
				let imageUploadFunction = options?.imageUploadFunction
					? imageUploadCallback
					: undefined;

				import("easymde").then((module) => {
					if (isCurrent) {
						editor = new module.default(
							Object.assign(
								{
									hideIcons: ["guide", "side-by-side", 'preview'],
								},
								initialOptions,
								options,
								{
									imageUploadFunction,
								}
							)
						);
						setEditorInstance(editor);
					}
				});
			}
			return () => {
				isCurrent = false;
				editor?.toTextArea();
				editor?.cleanup();
			};
			// Intentionally ignoring `initialValue` since it is thrown away after the
			// initial render anyway
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [textareaElement, fieldId, imageUploadCallback, options]);

		let codemirror = useMemo(
			() => editorInstance?.codemirror,
			[editorInstance?.codemirror]
		);

		useEffect(() => {
			// If change comes from the event we don't need to update `SimpleMDE`
			// value as it already has it Otherwise we shall set it as it comes from
			// `props` set from the outside. E.g. by some reset button and whatnot
			if (isControlled && nonEventChangeRef.current) {
				editorInstance?.value(value ?? "");
			}
			nonEventChangeRef.current = true;
		}, [editorInstance, value, isControlled]);

		let onCodemirrorChangeHandler = useCallback(
			(_: Editor | Event, changeObject?: EditorChange) => {
				// if (editor?.value() !== currentValueRef.current) {
				// 	nonEventChangeRef.current = false;
				// 	onChange?.(editor?.value() ?? "", changeObject);
				// }
			},
			[
				/* editor, onChange */
			]
		);

		useEffect(() => {
			// For some reason it doesn't work out of the box, this makes sure it's working correctly
			if (options?.autofocus) {
				codemirror?.focus();
				codemirror?.setCursor(codemirror?.lineCount(), 0);
			}
		}, [codemirror, options?.autofocus]);

		const getCursorCallback = useCallback(() => {
			// https://codemirror.net/doc/manual.html#api_selection
			codemirror && getLineAndCursor?.(codemirror.getDoc().getCursor());
		}, [codemirror, getLineAndCursor]);

		useEffect(() => {
			getCursorCallback();
		}, [getCursorCallback]);

		useEffect(() => {
			editorInstance && getMdeInstance?.(editorInstance);
		}, [editorInstance, getMdeInstance]);

		useEffect(() => {
			codemirror && getCodemirrorInstance?.(codemirror);
		}, [codemirror, getCodemirrorInstance, getMdeInstance]);

		useEffect(() => {
			// https://codemirror.net/doc/manual.html#option_extraKeys
			if (extraKeys && codemirror) {
				codemirror.setOption(
					"extraKeys",
					Object.assign({}, codemirror.getOption("extraKeys"), extraKeys)
				);
			}
		}, [codemirror, extraKeys]);

		useEffect(() => {
			let toolbarNode =
				elementWrapperRef.current?.getElementsByClassName(
					"editor-toolbarNode"
				)[0];
			let handler = codemirror ? onCodemirrorChangeHandler : undefined;
			if (handler) {
				toolbarNode?.addEventListener("click", handler);
				return () => {
					toolbarNode?.removeEventListener("click", handler!);
				};
			}
		}, [codemirror, onCodemirrorChangeHandler]);

		useEffect(() => {
			let rootEditorNode =
				elementWrapperRef.current?.querySelector<HTMLDivElement>(
					"[role=application]"
				);
			let editorClass = `${ROOT_CLASS}__editor`;
			if (rootEditorNode && !rootEditorNode.classList.contains(editorClass)) {
				rootEditorNode.classList.add(editorClass);
			}
		}, [codemirror, onCodemirrorChangeHandler]);

		useEffect(() => {
			codemirror?.on("change", onCodemirrorChangeHandler);
			codemirror?.on("cursorActivity", getCursorCallback);
			return () => {
				codemirror?.off("change", onCodemirrorChangeHandler);
				codemirror?.off("cursorActivity", getCursorCallback);
			};
		}, [codemirror, getCursorCallback, onCodemirrorChangeHandler]);

		let prevEvents = useRef(events);

		useEffect(() => {
			let isNotFirstEffectRun = events !== prevEvents.current;
			isNotFirstEffectRun &&
				prevEvents.current &&
				Object.entries(prevEvents.current).forEach(([event, handler]) => {
					handler && codemirror?.off(event as keyof EditorEventMap, handler);
				});

			events &&
				Object.entries(events).forEach(([event, handler]) => {
					handler && codemirror?.on(event as keyof EditorEventMap, handler);
				});
			prevEvents.current = events;
			return () => {
				events &&
					Object.entries(events).forEach(([event, handler]) => {
						handler && codemirror?.off(event as keyof EditorEventMap, handler);
					});
			};
		}, [codemirror, events]);

		return (
			<div
				id={`${fieldId}-wrapper`}
				className={ROOT_CLASS}
				{...rest}
				ref={useComposedRefs(elementWrapperRef, ref)}
			>
				<MarkdownEditorContext.Provider
					value={{
						setTextRef: setTextareaElement,
						fieldId,
						value,
						defaultValue,
					}}
				>
					{children}
				</MarkdownEditorContext.Provider>
			</div>
		);
	}
);
MarkdownEditor.displayName = "MarkdownEditor";

const MarkdownEditorTextarea = React.forwardRef<
	HTMLTextAreaElement,
	MarkdownEditorTextareaProps
>(({ ...props }, forwardedRef) => {
	let { fieldId, setTextRef, value, defaultValue } = useMarkdownEditorContext();
	let ref = useComposedRefs(forwardedRef, setTextRef);
	return (
		<textarea
			{...props}
			id={fieldId}
			ref={ref}
			value={value}
			defaultValue={defaultValue}
			className={cx(`${ROOT_CLASS}__textarea`, {
				[`${ROOT_CLASS}__textarea--hidden`]: value || defaultValue,
			})}
			// style={{ display: "none" }}
		/>
	);
});
MarkdownEditorTextarea.displayName = "MarkdownEditorTextarea";

export { MarkdownEditor, MarkdownEditorTextarea };
export type { MarkdownEditorProps, MarkdownEditorTextareaProps };

function useComposedRefs<T>(
	...refs: (React.Ref<T> | ((instance: T) => void))[]
) {
	return useCallback(
		(instance: T) => {
			refs.forEach((ref) => {
				if (typeof ref === "function") {
					ref(instance);
				} else if (ref) {
					(ref as React.MutableRefObject<T>).current = instance;
				}
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs
	);
}
