import { useMemo } from "react"
import ReactGA from "react-ga"

export default function useGAInit(trackingCode?: string) {
  // init analytics with measurement ID
  const googleAnalytics = useMemo(() => {
    ReactGA.initialize(
      trackingCode || process.env.REACT_APP_NON_FIREBASE_ANALYTICS_TRACKING_CODE as string,
      {
        titleCase: false // don't automatically capitalize
      }
    )
    return ReactGA
  }, [trackingCode])
  return googleAnalytics
}
