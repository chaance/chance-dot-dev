import * as React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getNotes, MDXMatter } from "$lib/get-notes";
import { config } from "$src/site-config";
import Notes from "$pages/notes";

function Home({ notes }: InferGetStaticPropsType<typeof getStaticProps>) {
	return <Notes pageTitle={config.siteTitle} notes={notes} />;
}

export const getStaticProps: GetStaticProps<{
	notes: MDXMatter[];
}> = async () => {
	const notes = await getNotes();
	return {
		props: {
			notes,
		},
	};
};

export default Home;
