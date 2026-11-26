import * as React from "react";
import { Link } from "react-router";
import cx from "clsx";
import { InputText } from "~/ui/input";
import { getErrorMessageId } from "./admin-utils";

/**
 * Page title with an optional "Add New" style action next to it.
 */
export function AdminPageHeader({
	title,
	action,
	children,
}: {
	title: React.ReactNode;
	action?: { to: string; label: string };
	children?: React.ReactNode;
}) {
	return (
		<div className="AdminPageHeader">
			<h1 className="AdminPageHeader__title">{title}</h1>
			{action ? (
				<Link to={action.to} className="AdminButton AdminButton--small">
					{action.label}
				</Link>
			) : null}
			{children}
		</div>
	);
}

/**
 * A titled panel for grouping fields or actions (like a WordPress metabox).
 */
export function AdminPostbox({
	title,
	children,
	footer,
	className,
}: {
	title: React.ReactNode;
	children?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}) {
	let headingId = React.useId();
	return (
		<section
			className={cx("AdminPostbox", className)}
			aria-labelledby={headingId}
		>
			<h2 id={headingId} className="AdminPostbox__title">
				{title}
			</h2>
			{children ? <div className="AdminPostbox__body">{children}</div> : null}
			{footer ? <div className="AdminPostbox__footer">{footer}</div> : null}
		</section>
	);
}

/**
 * Two-column edit screen: main content on the left, postboxes on the right.
 */
export function AdminEditLayout({
	main,
	sidebar,
}: {
	main: React.ReactNode;
	sidebar: React.ReactNode;
}) {
	return (
		<div className="AdminEditLayout">
			<div className="AdminEditLayout__main">{main}</div>
			<div className="AdminEditLayout__sidebar">{sidebar}</div>
		</div>
	);
}

/**
 * Label, control and error message for a single form field.
 */
export function AdminField({
	id,
	label,
	hideLabel,
	required,
	errorMessage,
	children,
}: {
	id: string;
	label: React.ReactNode;
	hideLabel?: boolean;
	required?: boolean;
	errorMessage?: string | null;
	children: React.ReactNode;
}) {
	return (
		<div className="AdminField">
			<label
				htmlFor={id}
				className={cx("AdminField__label", { "sr-only": hideLabel })}
			>
				{label}
				{required ? (
					<span className="AdminField__required" aria-hidden>
						{" "}
						*
					</span>
				) : null}
			</label>
			{children}
			{errorMessage ? (
				<div id={getErrorMessageId(id)} className="AdminField__error">
					{errorMessage}
				</div>
			) : null}
		</div>
	);
}

type AdminTextFieldType =
	"text" | "email" | "password" | "url" | "number" | "tel" | "datetime-local";

/**
 * A labeled text input wired up for validation errors.
 */
export function AdminTextField({
	id,
	name,
	label,
	type = "text",
	required,
	placeholder,
	errorMessage,
	defaultValue,
	min,
	max,
}: {
	id: string;
	name: string;
	label: string;
	type?: AdminTextFieldType;
	required?: boolean;
	placeholder?: string;
	errorMessage?: string | null;
	defaultValue?: string | null;
	min?: string | number;
	max?: string | number;
}) {
	return (
		<AdminField
			id={id}
			label={label}
			required={required}
			errorMessage={errorMessage}
		>
			<InputText
				name={name}
				id={id}
				type={type}
				required={required || undefined}
				placeholder={placeholder}
				aria-invalid={errorMessage ? true : undefined}
				aria-errormessage={errorMessage ? getErrorMessageId(id) : undefined}
				defaultValue={defaultValue || undefined}
				min={min}
				max={max}
			/>
		</AdminField>
	);
}
