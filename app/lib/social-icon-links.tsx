import {
	GitHubIcon,
	LinkedInIcon,
	TwitterIcon,
	MastodonIcon,
} from "~/ui/icons";

export const socialIconLinks: SocialIconDescriptor[] = [
	{
		label: "Twitter",
		href: "https://twitter.com/chancethedev/",
		Icon: (props) => <TwitterIcon {...props} />,
		id: "twitter",
	},
	{
		label: "Mastodon",
		href: "https://mas.to/@chancethedev",
		Icon: (props) => <MastodonIcon {...props} />,
		id: "mastodon",
	},
	{
		label: "GitHub",
		href: "https://www.github.com/chaance/",
		Icon: (props) => <GitHubIcon {...props} />,
		id: "github",
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/chaance/",
		Icon: (props) => <LinkedInIcon {...props} />,
		id: "linkedin",
	},
];

interface SocialIconDescriptor {
	label: string;
	href: string;
	Icon: React.ComponentType<React.ComponentProps<typeof TwitterIcon>>;
	id: string;
}
