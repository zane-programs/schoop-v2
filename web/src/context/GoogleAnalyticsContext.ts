import { createContext } from "react";
import ReactGA from "react-ga";

const GoogleAnalyticsContext = createContext(ReactGA);

export default GoogleAnalyticsContext;
