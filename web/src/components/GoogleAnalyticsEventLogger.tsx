import React from "react";

// hooks
import useGAFromContext from "../hooks/useGAFromContext";

interface GoogleAnalyticsEventLoggerProps {
  children: React.ReactNode; // is this the right type?
  category: string;
  action: string;
  label?: string;
}

function GoogleAnalyticsEventLogger(props: GoogleAnalyticsEventLoggerProps) {
  const googleAnalytics = useGAFromContext();
  return (
    <span
      onClick={() =>
        googleAnalytics.event({
          category: props.category,
          action: props.action,
          label: props?.label,
        })
      }
    >
      {props.children}
    </span>
  );
}

export default React.memo(GoogleAnalyticsEventLogger);
