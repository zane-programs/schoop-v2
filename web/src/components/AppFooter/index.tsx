import React, { useContext } from "react";

// context
import AppConfigContext from "../../context/AppConfigContext";

// components
import GoogleAnalyticsEventLogger from "../GoogleAnalyticsEventLogger";
import NewTabLink from "../NewTabLink";

// styles
import styles from "./AppFooter.module.css";

// misc
import packageJson from "../../../package.json";

function AppFooter() {
  const year = new Date().getFullYear();
  const { appName } = useContext(AppConfigContext);

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContent}>
        <span>
          <strong>
            {appName} v{packageJson.version}
          </strong>{" "}
          | &copy; {year} |{" "}
          <GoogleAnalyticsEventLogger
            category="Navigation"
            action="OpenOutboundLink"
            label="AboutPage"
          >
            <NewTabLink href="https://blog.schoop.app/about.html?utm_source=app&amp;utm_medium=footer&amp;utm_campaign=schoop_blog">
              Learn More
            </NewTabLink>
          </GoogleAnalyticsEventLogger>
        </span>
      </div>
    </footer>
  );
}

export default React.memo(AppFooter);
