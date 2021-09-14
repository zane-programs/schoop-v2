import ReactDOM from "react-dom";
import App from "./App";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { BrowserRouter as Router } from "react-router-dom";
import LogRocket from "logrocket";
import reportWebVitals from "./reportWebVitals";

// global styles
import "./global.css";
import "focus-visible";

// telemetry stuff runs in production only
if (process.env.NODE_ENV === "production") {
  // init error reporting
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  Sentry.configureScope((scope) => {
    // configure Sentry to send whether we
    // are in the development environment
    // or in production
    scope.setExtra("NODE_ENV", process.env.NODE_ENV);
  });

  // init LogRocket
  LogRocket.init(process.env.REACT_APP_LOGROCKET_ID as string);
  LogRocket.getSessionURL((sessionURL) => {
    // add to sentry
    Sentry.configureScope((scope) => {
      scope.setExtra("logrocketSessionURL", sessionURL);
    });
  });
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
