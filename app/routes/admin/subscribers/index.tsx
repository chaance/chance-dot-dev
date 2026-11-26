import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { requireUserId } from "~/lib/session.server";
import { getAllSubscribers } from "~/models/email-list.server";
import { AdminPageHeader } from "~/features/admin/admin-ui";
import { formatAdminDate } from "~/features/admin/admin-utils";

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request);
	let subscribers = await getAllSubscribers();
	subscribers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	return { subscribers };
}

export default function AdminSubscribersIndex() {
	let { subscribers } = useLoaderData<typeof loader>();
	return (
		<div>
			<AdminPageHeader
				title="Subscribers"
				action={{ to: "/admin/subscribers/new", label: "Add New Subscriber" }}
			/>
			<div className="AdminTableNav">
				{subscribers.length} {subscribers.length === 1 ? "item" : "items"}
			</div>
			<table className="AdminTable">
				<thead>
					<tr>
						<th scope="col">Email</th>
						<th scope="col" className="AdminTable__col--secondary">
							Name
						</th>
						<th scope="col" className="AdminTable__col--narrow">
							Subscribed
						</th>
					</tr>
				</thead>
				<tbody>
					{subscribers.length < 1 ? (
						<tr>
							<td colSpan={3} className="AdminTable__empty">
								No subscribers yet.{" "}
								<Link to="/admin/subscribers/new">Add one.</Link>
							</td>
						</tr>
					) : (
						subscribers.map((subscriber) => {
							let name = [subscriber.nameFirst, subscriber.nameLast]
								.filter(Boolean)
								.join(" ");
							return (
								<tr key={subscriber.id}>
									<td>
										<Link
											to={subscriber.id}
											className="AdminTable__primary-link"
										>
											{subscriber.email}
										</Link>
										<div className="AdminTable__row-actions">
											<Link to={subscriber.id}>Edit</Link>
										</div>
									</td>
									<td className="AdminTable__col--secondary">
										{name || <span className="AdminTable__muted">—</span>}
									</td>
									<td className="AdminTable__col--narrow AdminTable__muted">
										{formatAdminDate(subscriber.createdAt)}
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}
