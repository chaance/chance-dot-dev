import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	NavLink,
	type ShouldReloadFunction,
	useLoaderData,
} from "@remix-run/react";
import cx from "clsx";
import { requireUserId } from "~/lib/session.server";
import { getAllEmailLists } from "~/models/email-list.server";

export async function loader({ request }: LoaderArgs) {
	await requireUserId(request);
	let lists = await getAllEmailLists();
	return json({ lists });
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	return !!submission && submission.method.toLowerCase() !== "get";
};

export default function AdminSubscribersIndex() {
	let { lists } = useLoaderData<typeof loader>();
	return (
		<div className="subscriber-index">
			{lists.length < 1 ? (
				<p>
					No lists found.{" "}
					<Link
						to="new"
						style={{
							textDecoration: "underline",
						}}
					>
						Create a new list.
					</Link>
				</p>
			) : (
				<ul>
					{lists.map((list) => (
						<li key={list.id} className="nav-item" data-level="2">
							<NavLink
								data-level="2"
								className={({ isActive }) =>
									cx("nav-item-link", {
										active: isActive,
									})
								}
								to={list.id}
							>
								{list.name}
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
