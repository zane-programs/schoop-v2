import React, { useContext } from "react";

// context
import AppConfigContext from "../../context/AppConfigContext";

// components
import GoogleAnalyticsEventLogger from "../GoogleAnalyticsEventLogger";
import NewTabLink from "../NewTabLink";

// styles
import styles from "./AppFooter.module.css";

function AppFooter() {
  const year = new Date().getFullYear();
  const { appName } = useContext(AppConfigContext);

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContent}>
        <span>
          <strong>{appName}</strong> | &copy; {year} Zane St. John |{" "}
          <GoogleAnalyticsEventLogger
            category="Navigation"
            action="OpenOutboundLink"
            label="AboutPage"
          >
            <NewTabLink href="https://blog.schoop.app/about.html?utm_source=app&amp;utm_medium=footer&amp;utm_campaign=schoop_blog">
              About
            </NewTabLink>
          </GoogleAnalyticsEventLogger>{" "}
          |{" "}
          <GoogleAnalyticsEventLogger
            category="Navigation"
            action="OpenOutboundLink"
            label="Blog"
          >
            <NewTabLink href="https://blog.schoop.app/?utm_source=app&amp;utm_medium=footer&amp;utm_campaign=schoop_blog">
              Blog
            </NewTabLink>
          </GoogleAnalyticsEventLogger>
        </span>
      </div>
    </footer>
  );
}

export default React.memo(AppFooter);
