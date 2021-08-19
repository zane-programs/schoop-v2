import { useCallback, useEffect, useMemo, useState } from "react";

// components
// @ts-ignore
import { Widget } from "@typeform/embed-react";
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";

// hooks
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useGAFromContext from "../../hooks/useGAFromContext";

// util
import CustomSwal from "../../util/CustomSwal";

// styles
import styles from "./Feedback.module.css";

export default function Feedback() {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const googleAnalytics = useGAFromContext();

  const [isLoading, setIsLoading] = useState(true);

  const loadingElem: React.ReactNode | null = useMemo(
    () =>
      isLoading ? (
        <LoadingPlaceholderScreen title="Loading feedback form, please wait..." />
      ) : null,
    [isLoading]
  );

  const handleFormSubmit = useCallback(() => {
    // log event in Google Analytics
    googleAnalytics.event({
      category: "Feedback",
      action: "SubmitFeedback",
    });

    // prompt user with modal (thanks, then go home)
    CustomSwal.fire({
      title: "Thank you!",
      html: (
        <p>
          Thank you for your feedback! We may reach out to you with the email
          provided if we have any follow up questions.
        </p>
      ),
    }).then(() => navigate("/home"));
  }, [googleAnalytics, navigate]);

  // set page title
  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  return (
    <>
      {loadingElem}
      <Widget
        id={process.env.NODE_ENV === "development" ? "dKjxftTa" : "SPfjro4R"}
        className={styles.feedbackForm}
        onReady={() => setIsLoading(false)}
        onSubmit={handleFormSubmit}
        style={{ display: isLoading ? "none" : null }}
      />
    </>
  );
}
