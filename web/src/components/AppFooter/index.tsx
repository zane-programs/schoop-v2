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
  const { appName } = useContext(AppConfigContext);

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContent}>
        <span>
          <strong>
            {appName} v{packageJson.version}
          </strong>{" "}
          {/* TODO: update privacy policy and host with the React stuff */}|{" "}
          <GoogleAnalyticsEventLogger
            category="Navigation"
            action="OpenOutboundLink"
            label="PrivacyPolicy"
          >
            <NewTabLink href="https://schoop.app/privacy_policy.html">
              Privacy
            </NewTabLink>
          </GoogleAnalyticsEventLogger>{" "}
          |{" "}
          <GoogleAnalyticsEventLogger
            category="Navigation"
            action="OpenOutboundLink"
            label="GitHubPage"
          >
            <NewTabLink href="https://github.com/Schoop-App">GitHub</NewTabLink>
          </GoogleAnalyticsEventLogger>
        </span>
      </div>
    </footer>
  );
}

export default React.memo(AppFooter);
