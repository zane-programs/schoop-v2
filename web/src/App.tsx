import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import * as Sentry from "@sentry/react";
// firebase
// import firebase from "firebase";
// import "firebase/analytics";

// config
import { appConfig } from "./config";

// context
import PageContext from "./context/PageContext";
import AppConfigContext from "./context/AppConfigContext";
import SpacetimeContext from "./context/SpacetimeContext";
import SideBarContext from "./context/SideBarContext";
import { StudentAdapterContext } from "./hooks/useStudentAdapter";
import GoogleAnalyticsContext from "./context/GoogleAnalyticsContext";

// hooks
import useWindowDimensions from "./hooks/useWindowDimensions";
import useTick from "./hooks/useTick";
// analytics hooks
import useGAInit from "./hooks/useGAInit";
import useGAFromContext from "./hooks/useGAFromContext";

// components
import NavBar from "./components/NavBar";
import AppFooter from "./components/AppFooter";
import LoadingPlaceholderScreen from "./components/LoadingPlaceholderScreen";
import SideBar from "./components/SideBar";
import AppSubcontainer from "./components/AppSubcontainer";

// auth
import firebaseApp from "./auth/base";
import { AuthProvider, AuthContext } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";

// util
import StudentAdapter from "./util/StudentAdapter"; // student util

// interfaces
import StudentClass from "./interfaces/StudentClass";
import StudentInfo from "./interfaces/StudentInfo";

// styles
import "normalize.css";

// pages
import IndexPage from "./pages/IndexPage";
import JoinClass from "./pages/JoinClass"; // TODO: lazy load this and set up Suspense
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const WWResources = lazy(() => import("./pages/WWResources"));
const Feedback = lazy(() => import("./pages/Feedback"));

export default function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true); // stores if it's initial load of page
  const [pageTitle, setPageTitle] = useState(null); // stores page title for application
  const googleAnalytics = useGAInit(); // init google analytics

  // const windowDimensions = useWindowDimensions();
  useEffect(() => {
    // for active styling
    document.getElementById("root")?.addEventListener("click", () => {});
    // unmount:
    return () => {
      document.getElementById("root")?.removeEventListener("click", () => {});
    };
  }, []);

  // watch for page title change and update document.title
  useEffect(() => {
    // if page has title, set it to that
    const titleToSet = pageTitle
      ? `${pageTitle} | ${appConfig.appName}`
      : appConfig.appName;

    // set title
    document.title = titleToSet;
  }, [pageTitle]);

  const appContainerStyle = useMemo(() => {
    return {
      "--app-padding": appConfig.appPadding,
      "--main-theme-color": appConfig.themeColor,
      "--navbar-height": appConfig.navBarHeight,
      "--footer-height": appConfig.appFooterHeight,
      "--default-font": appConfig.defaultFont,
      "--heading-font": appConfig.headingFont,
      "--app-background-color": appConfig.backgroundColor,
      touchAction: "manipulation", // prevent double tap zoom
    } as React.CSSProperties;
  }, []);

  // custom styles to fix sweetalert from css reset
  const sweetAlertCustomStyles = useMemo(
    () => `
      .swal2-container .swal2-title,
      .swal2-container button[type="button"] {
        font-family: ${appConfig.headingFont};
      }
      .swal2-container #swal2-content {
        font-family: ${appConfig.defaultFont};
      }
      .swal2-icon-content {
        font-family: ${appConfig.defaultFont};
      }
    `,
    []
  );

  return (
    <PageContext.Provider
      value={{
        isInitialLoad,
        setIsInitialLoad,
        title: pageTitle,
        setTitle: setPageTitle,
      }}
    >
      <AppConfigContext.Provider value={appConfig}>
        <style
          dangerouslySetInnerHTML={{
            __html: sweetAlertCustomStyles,
          }}
        />
        <GoogleAnalyticsContext.Provider value={googleAnalytics}>
          <AuthProvider>
            <div style={appContainerStyle}>
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <PrivateRoute path="/" element={<AuthenticatedLayout />}>
                  <Route path="home" element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="resources" element={<WWResources />} />
                  <Route path="feedback" element={<Feedback />} />
                </PrivateRoute>
                <PrivateRoute
                  path="join/:classDocName"
                  element={<JoinClass />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </GoogleAnalyticsContext.Provider>
      </AppConfigContext.Provider>
    </PageContext.Provider>
  );
}

interface AuthenticatedLayoutContextInterface {
  // student profile information
  studentInfoHookValue: [StudentInfo | undefined, boolean, Error | undefined];
  // student classes information
  studentClassesHookValue: [
    StudentClass[] | undefined,
    boolean,
    Error | undefined
  ];
}

export const AuthenticatedLayoutContext = React.createContext(
  {} as AuthenticatedLayoutContextInterface
);

function AuthenticatedLayout() {
  const date = useTick(); // date ticker
  const windowDimensions = useWindowDimensions(); // window dimensions
  const [sideBarIsVisible, setSidebarVisibility] = useState(false); // sidebar state
  const { pathname, search } = useLocation(); // url path
  const auth = useContext(AuthContext); // firebase auth
  const { setIsInitialLoad } = useContext(PageContext); // setter for initial load
  const googleAnalytics = useGAFromContext(); // get google analytics

  // create student adapter
  const studentAdapter = useMemo(
    () => new StudentAdapter(firebaseApp, auth.currentUser?.uid || ""),
    [auth.currentUser]
  );

  const studentInfoHookValue = studentAdapter.useStudentInfo();
  const studentClassesHookValue = studentAdapter.useStudentClasses();

  const minHeight = useMemo(
    () =>
      windowDimensions.height -
      removePx(appConfig.navBarHeight) -
      2 * removePx(appConfig.appPadding) -
      removePx(appConfig.appFooterHeight),
    [windowDimensions]
  );

  const styleVars = useMemo(() => {
    return { "--container-height": `${minHeight}px` } as React.CSSProperties;
  }, [minHeight]);

  // log page view with Google Analytics when
  // the pathname or search value changes
  useEffect(() => {
    // track pageview
    googleAnalytics.pageview(pathname + search);
  }, [googleAnalytics, pathname, search]);

  // it's no longer the initial page load, so
  // reflect that change:
  useEffect(() => {
    setIsInitialLoad(false);
  }, [setIsInitialLoad]);

  // scroll restoration on pathname change
  useEffect(() => {
    window.scrollTo(0, 0); // reset scroll position
    ReactTooltip.hide(); // hide tooltip
  }, [pathname]);

  // add student email to error reports
  useEffect(() => {
    Sentry.configureScope((scope) => {
      scope.setExtra("userEmail", auth.currentUser?.email);
    });
  }, [auth.currentUser]);

  return (
    <AuthenticatedLayoutContext.Provider
      value={{
        studentInfoHookValue,
        studentClassesHookValue,
      }}
    >
      <SpacetimeContext.Provider value={date}>
        <StudentAdapterContext.Provider value={studentAdapter}>
          <SideBarContext.Provider
            value={{
              isVisible: sideBarIsVisible,
              setVisibility: setSidebarVisibility,
            }}
          >
            <SideBar isVisible={sideBarIsVisible} />
            <AppSubcontainer>
              <NavBar />
              <main
                style={{
                  padding: appConfig.appPadding,
                  backgroundColor: appConfig.backgroundColor,
                  minHeight: `${minHeight}px`,
                  overflowX: "hidden",
                  fontFamily: "var(--default-font)",
                  ...styleVars,
                }}
              >
                <Suspense fallback={<LoadingPlaceholderScreen />}>
                  <Outlet />
                </Suspense>
              </main>
              <AppFooter />
            </AppSubcontainer>
          </SideBarContext.Provider>
        </StudentAdapterContext.Provider>
      </SpacetimeContext.Provider>
    </AuthenticatedLayoutContext.Provider>
  );
}

// const LoadingFallback = React.memo(function LoadingFallback() {
//   useEffect(() => {
//     NProgress.start();
//     return () => {
//       // end NProgress once
//       // loading is over
//       NProgress.done();
//     };
//   });
//   return <LoadingPlaceholderScreen />;
// });

// not found "page"
function NotFound() {
  const googleAnalytics = useGAFromContext();
  const { pathname, search } = useLocation();

  // log event
  googleAnalytics.event({
    category: "Navigation",
    action: "NotFound",
    label: pathname + search, // where the not found occurred
  });

  // TODO: make this page aesthetically
  // pleasing and match the theme!
  return (
    <>
      <h1>Not Found</h1>
      <p>
        We could not find the page{" "}
        <strong>
          {pathname}
          {search}
        </strong>
        .
      </p>
    </>
  );
}

// TODO: move this elsewhere
export const removePx = (text: React.ReactText | string) =>
  parseInt((text as string).replace("px", ""));
