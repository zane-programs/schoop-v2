import { useContext } from "react";
import GoogleAnalyticsContext from "../context/GoogleAnalyticsContext";

export default function useGAFromContext() {
  const googleAnalytics = useContext(GoogleAnalyticsContext);
  return googleAnalytics;
}
