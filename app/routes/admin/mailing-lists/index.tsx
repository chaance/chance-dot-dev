import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { requireUserId } from "~/lib/session.server";
import { getAllEmailListsWithSubscriberCounts } from "~/models/email-list.server";
import { AdminPageHeader } from "~/features/admin/admin-ui";
import { formatAdminDate } from "~/features/admin/admin-utils";

export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request);
	let lists = await getAllEmailListsWithSubscriberCounts();
	return { lists };
}

export default function AdminMailingListsIndex() {
	let { lists } = useLoaderData<typeof loader>();
	return (
		<div>
			<AdminPageHeader
				title="Mailing Lists"
				action={{ to: "/admin/mailing-lists/new", label: "Add New List" }}
			/>
			<div className="AdminTableNav">
				{lists.length} {lists.length === 1 ? "item" : "items"}
			</div>
			<table className="AdminTable">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col" className="AdminTable__col--narrow">
							Subscribers
						</th>
						<th
							scope="col"
							className="AdminTable__col--narrow AdminTable__col--secondary"
						>
							Created
						</th>
					</tr>
				</thead>
				<tbody>
					{lists.length < 1 ? (
						<tr>
							<td colSpan={3} className="AdminTable__empty">
								No mailing lists yet.{" "}
								<Link to="/admin/mailing-lists/new">Create one.</Link>
							</td>
						</tr>
					) : (
						lists.map((list) => (
							<tr key={list.id}>
								<td>
									<Link to={list.id} className="AdminTable__primary-link">
										{list.name}
									</Link>
									<div className="AdminTable__row-actions">
										<Link to={list.id}>Edit</Link>
									</div>
								</td>
								<td className="AdminTable__col--narrow">
									{list.subscriberCount}
								</td>
								<td className="AdminTable__col--narrow AdminTable__col--secondary AdminTable__muted">
									{formatAdminDate(list.createdAt)}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
