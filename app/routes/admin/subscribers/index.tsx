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
import { getAllSubscribers } from "~/models/email-list.server";

export async function loader({ request }: LoaderArgs) {
	await requireUserId(request);
	let subscribers = await getAllSubscribers();
	return json({ subscribers });
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
	return !!submission && submission.method.toLowerCase() !== "get";
};

export default function AdminSubscribersIndex() {
	let { subscribers } = useLoaderData<typeof loader>();
	return (
		<div className="subscriber-index">
			{subscribers.length < 1 ? (
				<p>
					No subscribers found.{" "}
					<Link
						to="new"
						style={{
							textDecoration: "underline",
						}}
					>
						Create a new subscriber.
					</Link>
				</p>
			) : (
				<ul>
					{subscribers.map((subscriber) => (
						<li key={subscriber.id} className="nav-item" data-level="2">
							<NavLink
								data-level="2"
								className={({ isActive }) =>
									cx("nav-item-link", {
										active: isActive,
									})
								}
								to={subscriber.id}
							>
								{subscriber.email}
							</NavLink>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
