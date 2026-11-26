import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { requireUserId } from "~/lib/session.server";
import { getBlogPostListItems } from "~/models/blog-post.server";
import { AdminPageHeader } from "~/features/admin/admin-ui";
import { formatAdminDate } from "~/features/admin/admin-utils";

export async function loader({ request }: LoaderFunctionArgs) {
	let userId = await requireUserId(request);
	let posts = await getBlogPostListItems({
		userId,
		limit: 1000,
		select: ["id", "title", "slug", "createdAt", "updatedAt"],
	});
	posts.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
	return { posts };
}

export default function AdminBlogIndex() {
	let { posts } = useLoaderData<typeof loader>();
	return (
		<div>
			<AdminPageHeader
				title="Posts"
				action={{ to: "/admin/blog/new", label: "Add New Post" }}
			/>
			<div className="AdminTableNav">
				{posts.length} {posts.length === 1 ? "item" : "items"}
			</div>
			<table className="AdminTable">
				<thead>
					<tr>
						<th scope="col">Title</th>
						<th scope="col" className="AdminTable__col--secondary">
							Slug
						</th>
						<th scope="col" className="AdminTable__col--narrow">
							Date
						</th>
					</tr>
				</thead>
				<tbody>
					{posts.length < 1 ? (
						<tr>
							<td colSpan={3} className="AdminTable__empty">
								No posts yet. <Link to="/admin/blog/new">Write one.</Link>
							</td>
						</tr>
					) : (
						posts.map((post) => (
							<tr key={post.id}>
								<td>
									<Link
										to={`/admin/blog/${post.id}`}
										className="AdminTable__primary-link"
									>
										{post.title || "(no title)"}
									</Link>
									<div className="AdminTable__row-actions">
										<Link to={`/admin/blog/${post.id}`}>Edit</Link>
										{post.slug ? (
											<Link to={`/blog/${post.slug}`}>View</Link>
										) : null}
									</div>
								</td>
								<td className="AdminTable__col--secondary AdminTable__muted">
									{post.slug ? `/blog/${post.slug}` : "—"}
								</td>
								<td className="AdminTable__col--narrow">
									<div>Published</div>
									<div className="AdminTable__muted">
										{formatAdminDate(post.createdAt)}
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
