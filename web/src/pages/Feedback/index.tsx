import { useEffect, useMemo, useState } from "react";

// components
// @ts-ignore
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";

// hooks
import usePageTitle from "../../hooks/usePageTitle";

// styles
import styles from "./Feedback.module.css";

export default function Feedback() {
  const { setTitle } = usePageTitle();

  const [isLoading, setIsLoading] = useState(true);

  const loadingElem: React.ReactNode | null = useMemo(
    () =>
      isLoading ? (
        <LoadingPlaceholderScreen title="Loading feedback form, please wait..." />
      ) : null,
    [isLoading]
  );

  // set page title
  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  return (
    <>
      {loadingElem}
      <iframe
        src="https://tally.so/embed/wMblEn?hideTitle=1&alignLeft=1"
        title="Schoop Feedback"
        scrolling="no"
        className={styles.feedbackForm}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? "none" : undefined }}
      ></iframe>
    </>
  );
}
