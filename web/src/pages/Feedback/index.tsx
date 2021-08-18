import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

// components
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";
import useGAFromContext from "../../hooks/useGAFromContext";

// hooks
import usePageTitle from "../../hooks/usePageTitle";

// util
import CustomSwal from "../../util/CustomSwal";

export default function Feedback() {
  const navigate = useNavigate();
  const googleAnalytics = useGAFromContext();
  const { setTitle } = usePageTitle();

  const [isLoading, setLoadingState] = useState(true); // whether or not the state is loading
  const [formHasBeenSubmitted, setFormHasBeenSubmitted] = useState(false); // whether or not form was submitted
  const numFormLoads = useRef(0);

  const loadingElem: React.ReactNode | null = useMemo(
    () =>
      isLoading ? (
        <LoadingPlaceholderScreen title="Loading feedback form, please wait..." />
      ) : null,
    [isLoading]
  );

  const handleFeedbackFrameLoad = useCallback(() => {
    setLoadingState(false);
    // hack to record google analytics
    // event when the form is submitted
    if (numFormLoads.current === 1) {
      googleAnalytics.event({
        category: "Feedback",
        action: "SubmitFeedback",
      });
      setFormHasBeenSubmitted(true); // form is done
    }
    numFormLoads.current++; // increment load count
  }, [googleAnalytics]);

  // set page title
  useEffect(() => {
    setTitle("Feedback");
  }, [setTitle]);

  // custom form submit screen
  if (formHasBeenSubmitted) {
    CustomSwal.fire({
      title: "Feedback Submitted",
      html: (
        <p>
          You have successfully submitted your feedback. We will get back to you
          as soon as possible. For urgent matters, please email Zane at{" "}
          <a href="mailto:zstjohn22@windwardschool.org">
            zstjohn22@windwardschool.org
          </a>
          .
        </p>
      ),
    }).then(() => navigate("/home"));
    return <div>Feedback Submitted Successfully</div>;
  }

  return (
    <>
      {loadingElem}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSe2rrOGqAJQGMx7T3TKGWJMlmJV7PtRr-NR6jqEezbbAQbQZw/viewform?embedded=true"
        style={{
          width: "100%",
          // height is constant for now;
          // still trying to see if we
          // can match the height of the
          // inner content...
          height: "1750px",
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        title="Submit Feedback"
        onLoad={handleFeedbackFrameLoad}
        hidden={isLoading}
      ></iframe>
    </>
  );
}
