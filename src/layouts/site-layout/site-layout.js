import * as React from "react";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import { Header } from "$components/header";
import { Footer } from "$components/footer";
import { Section } from "$components/heading";
import { useRouter } from "next/router";
const styles = require("./site-layout.module.scss");

const SiteLayout = function SiteLayout({ children }) {
	const { pathname } = useRouter();

	// On the homepage, the heading count context should start from the site
	// layout because the site title serves as the page's h1 tag.
	const ContentWrapper = pathname === "/" ? Section : React.Fragment;
	return (
		<React.Fragment>
			<SkipNavLink />
			<div className={styles.wrapper}>
				<div aria-hidden>
					<div className={styles.decorTop} />
					<div className={styles.decorRight} />
					<div className={styles.decorBottom} />
					<div className={styles.decorLeft} />
				</div>
				<Header />
				<ContentWrapper>
					<div className={styles.contentWrapper}>
						<SkipNavContent />
						<div>{children}</div>
					</div>
					<Footer />
				</ContentWrapper>
			</div>
		</React.Fragment>
	);
};

export default SiteLayout;
