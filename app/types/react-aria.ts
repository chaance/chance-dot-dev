// React Aria is annoying written with very loose types for things like HTML
// elements. So I'm soft-forking to use more precises types internally.

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type {
	FocusEvent,
	KeyboardEvent as ReactKeyboardEvent,
	SyntheticEvent,
} from "react";

// Event bubbling can be problematic in real-world applications, so the default for React Spectrum components
// is not to propagate. This can be overridden by calling continuePropagation() on the event.
export type BaseEvent<T extends SyntheticEvent> = T & {
	/**
	 * Use continuePropagation.
	 * @deprecated */
	// stopPropagation(): void;
	continuePropagation(): void;
};

export type KeyboardEvent<T extends Element = Element> = BaseEvent<
	ReactKeyboardEvent<T>
>;

export type PointerType = "mouse" | "pen" | "touch" | "keyboard" | "virtual";

export interface PressEvent<T extends Element = Element> {
	/** The type of press event being fired. */
	type: "pressstart" | "pressend" | "pressup" | "press";
	/** The pointer type that triggered the press event. */
	pointerType: PointerType;
	/** The target element of the press event. */
	target: T;
	/** Whether the shift keyboard modifier was held during the press event. */
	shiftKey: boolean;
	/** Whether the ctrl keyboard modifier was held during the press event. */
	ctrlKey: boolean;
	/** Whether the meta keyboard modifier was held during the press event. */
	metaKey: boolean;
	/** Whether the alt keyboard modifier was held during the press event. */
	altKey: boolean;
}

export interface LongPressEvent<T extends Element = Element>
	extends Omit<PressEvent<T>, "type"> {
	/** The type of long press event being fired. */
	type: "longpressstart" | "longpressend" | "longpress";
}

export interface HoverEvent<T extends Element = Element> {
	/** The type of hover event being fired. */
	type: "hoverstart" | "hoverend";
	/** The pointer type that triggered the hover event. */
	pointerType: "mouse" | "pen";
	/** The target element of the hover event. */
	target: T;
}

export interface KeyboardEvents<T extends Element = Element> {
	/** Handler that is called when a key is pressed. */
	onKeyDown?(e: KeyboardEvent<T>): void;
	/** Handler that is called when a key is released. */
	onKeyUp?(e: KeyboardEvent<T>): void;
}

export interface FocusEvents<
	Target extends Element = Element,
	RelatedTarget extends Element = Element,
> {
	/** Handler that is called when the element receives focus. */
	onFocus?(e: FocusEvent<Target, RelatedTarget>): void;
	/** Handler that is called when the element loses focus. */
	onBlur?(e: FocusEvent<Target, RelatedTarget>): void;
	/** Handler that is called when the element's focus status changes. */
	onFocusChange?(isFocused: boolean): void;
}

export interface HoverEvents<Target extends Element = Element> {
	/** Handler that is called when a hover interaction starts. */
	onHoverStart?(e: HoverEvent<Target>): void;
	/** Handler that is called when a hover interaction ends. */
	onHoverEnd?(e: HoverEvent<Target>): void;
	/** Handler that is called when the hover state changes. */
	onHoverChange?(isHovering: boolean): void;
}

export interface PressEvents<Target extends Element = Element> {
	/** Handler that is called when the press is released over the target. */
	onPress?(e: PressEvent<Target>): void;
	/** Handler that is called when a press interaction starts. */
	onPressStart?(e: PressEvent<Target>): void;
	/**
	 * Handler that is called when a press interaction ends, either
	 * over the target or when the pointer leaves the target.
	 */
	onPressEnd?(e: PressEvent<Target>): void;
	/** Handler that is called when the press state changes. */
	onPressChange?(isPressed: boolean): void;
	/**
	 * Handler that is called when a press is released over the target, regardless of
	 * whether it started on the target or not.
	 */
	onPressUp?(e: PressEvent<Target>): void;
}

export interface FocusableProps<
	Target extends Element = Element,
	RelatedTarget extends Element = Element,
> extends FocusEvents<Target, RelatedTarget>,
		KeyboardEvents<Target> {
	/** Whether the element should receive focus on render. */
	autoFocus?: boolean;
}

interface BaseMoveEvent {
	/** The pointer type that triggered the move event. */
	pointerType: PointerType;
	/** Whether the shift keyboard modifier was held during the move event. */
	shiftKey: boolean;
	/** Whether the ctrl keyboard modifier was held during the move event. */
	ctrlKey: boolean;
	/** Whether the meta keyboard modifier was held during the move event. */
	metaKey: boolean;
	/** Whether the alt keyboard modifier was held during the move event. */
	altKey: boolean;
}

export interface MoveStartEvent extends BaseMoveEvent {
	/** The type of move event being fired. */
	type: "movestart";
}

export interface MoveMoveEvent extends BaseMoveEvent {
	/** The type of move event being fired. */
	type: "move";
	/** The amount moved in the X direction since the last event. */
	deltaX: number;
	/** The amount moved in the Y direction since the last event. */
	deltaY: number;
}

export interface MoveEndEvent extends BaseMoveEvent {
	/** The type of move event being fired. */
	type: "moveend";
}

export type MoveEvent = MoveStartEvent | MoveMoveEvent | MoveEndEvent;

export interface MoveEvents {
	/** Handler that is called when a move interaction starts. */
	onMoveStart?(e: MoveStartEvent): void;
	/** Handler that is called when the element is moved. */
	onMove?(e: MoveMoveEvent): void;
	/** Handler that is called when a move interaction ends. */
	onMoveEnd?(e: MoveEndEvent): void;
}

export interface ScrollEvent {
	/** The amount moved in the X direction since the last event. */
	deltaX: number;
	/** The amount moved in the Y direction since the last event. */
	deltaY: number;
}

export interface ScrollEvents {
	/** Handler that is called when the scroll wheel moves. */
	onScroll?(e: ScrollEvent): void;
}

export interface FocusableDOMProps extends DOMProps {
	/**
	 * Whether to exclude the element from the sequential tab order. If true,
	 * the element will not be focusable via the keyboard by tabbing. This should
	 * be avoided except in rare scenarios where an alternative means of accessing
	 * the element or its functionality via the keyboard is available.
	 */
	excludeFromTabOrder?: boolean;
}

export interface DOMProps {
	id?: string;
}
