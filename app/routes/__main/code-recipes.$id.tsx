import { data, type LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
	// TODO
	throw data(null, 404);
}
