import { useCallback, useState, useMemo, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
// import qs from "qs";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";
import usePageTitle from "../../hooks/usePageTitle";
import useGAFromContext from "../../hooks/useGAFromContext";

// auth
import app from "../../auth/base";
import popupProvider from "../../auth/popupProvider";

// context
import PageContext from "../../context/PageContext";

// util
import CustomSwal from "../../util/CustomSwal";
import { appConfig } from "../../config";

// styles
import styles from "./Login.module.css";

export default function Login({ isAuthed }: { isAuthed?: boolean | null }) {
  const pageContext = useContext(PageContext); // page context
  const windowDimensions = useWindowDimensions(); // window inner width/height
  const googleAnalytics = useGAFromContext();
  const { setTitle } = usePageTitle();

  const [authIsLoading, setAuthLoadingState] = useState(false);
  const [logInButtonVisible, setLogInButtonVisibility] = useState(false);

  const handleLogIn = useCallback(async () => {
    try {
      setAuthLoadingState(true); // start loading visual
      await app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await app.auth().signInWithPopup(popupProvider);
      googleAnalytics.event({ category: "Auth", action: "Login" });
    } catch (e) {
      setAuthLoadingState(false); // stop loading visual
      // show error dialog
      // TODO: clean up styling so that it's not inline
      CustomSwal.fire({
        title: "Sign-in Error",
        icon: "error",
        html: (
          <div>
            <p>
              <strong>Firebase Message:</strong> {e.message}
            </p>
            <p>
              <strong>
                <u>NOTE:</u> If you're in incognito or private browsing mode,
                please try opening the app in a regular browser tab. If your
                cookies are disabled, please enable them.
              </strong>
            </p>
          </div>
        ),
      });
    }
  }, [googleAnalytics]);

  // for login button class (regular vs loading)
  const logInButtonClass = useMemo(
    () =>
      authIsLoading
        ? `${styles.logInButton} ${styles.loading}`
        : styles.logInButton,
    [authIsLoading]
  );

  // handles button visibility
  const logInButtonVisibility = useMemo(() => {
    if (!pageContext.isInitialLoad) return ""; // if isn't initial load, don't do this visibility crud
    return logInButtonVisible ? "" : " " + styles.invisible;
  }, [logInButtonVisible, pageContext.isInitialLoad]);

  // sets visibility after a set period of time
  // because auth isn't instantly ready
  // TODO: finish fixing this to show login
  // button ONLY if no auth
  useEffect(() => {
    let timeout: number | undefined;

    if (!isAuthed) {
      const timeoutInterval = pageContext.isInitialLoad ? 750 : 0;
      timeout = window.setTimeout(() => {
        setLogInButtonVisibility(true);
        pageContext.setIsInitialLoad(false);
      }, timeoutInterval);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [pageContext, isAuthed]);

  // set page title
  useEffect(() => {
    setTitle("Login");
  }, [setTitle]);

  return (
    <main
      style={{
        width: windowDimensions.width,
        height: windowDimensions.height,
      }}
      className={styles.loginContainer}
    >
      <div className={styles.centeredContainer}>
        <h1 className={styles.appName}>{appConfig.appName}</h1>
        <button
          onClick={handleLogIn}
          className={logInButtonClass + logInButtonVisibility}
        >
          {authIsLoading ? "Signing In..." : "Sign In with Windward"}
        </button>
      </div>
    </main>
  );
}
