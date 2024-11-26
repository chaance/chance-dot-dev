import { data, type LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
	// TODO
	throw data(null, 404);
}
