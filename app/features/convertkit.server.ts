import { getRequiredServerEnvVar } from "~/lib/utils";

export async function addSubscriberToForm({
	email,
	nameFirst,
	nameLast,
	convertKitFormId,
}: {
	email: string;
	nameFirst: string;
	nameLast: string | null;
	convertKitFormId: string;
}) {
	const CONVERT_KIT_API_SECRET = getRequiredServerEnvVar(
		"CONVERT_KIT_API_SECRET",
	);
	const CONVERT_KIT_API_KEY = getRequiredServerEnvVar("CONVERT_KIT_API_KEY");
	let subscriberData = {
		api_key: CONVERT_KIT_API_KEY,
		api_secret: CONVERT_KIT_API_SECRET,
		first_name: nameFirst,
		email,
		fields: {
			last_name: nameLast,
		},
	};

	let response = await fetch(
		`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`,
		{
			method: "post",
			body: JSON.stringify(subscriberData),
			headers: { "Content-Type": "application/json" },
		},
	);
	let json = (await response.json()) as {
		subscription: { subscriber: any };
	};
	let subscriber: ConvertKitSubscriber = {
		id: json.subscription.subscriber.id,
		nameFirst: json.subscription.subscriber.first_name,
		nameLast: json.subscription.subscriber.fields.last_name || null,
		email: json.subscription.subscriber.email_address,
		state: json.subscription.subscriber.state,
		createdAt: json.subscription.subscriber.created_at,
		fields: json.subscription.subscriber.fields,
	};
	return subscriber;
}

interface ConvertKitSubscriber {
	id: number;
	nameFirst: string;
	nameLast: string | null;
	email: string;
	state: "active" | "inactive";
	createdAt: string;
	fields: Record<string, string | null>;
}
