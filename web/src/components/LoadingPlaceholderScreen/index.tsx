import React, { useContext, useMemo } from "react";

// context
import AppConfigContext from "../../context/AppConfigContext";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";

// components
import LoadingSpinner from "../LoadingSpinner";

// util
import { removePx } from "../../App"; // removes pixels and parses as int

// styles
import styles from "./LoadingPlaceholderScreen.module.css";

interface LoadingPlaceholderScreenProps {
  title?: string;
  independent?: boolean;
  showText?: boolean;
}

// TODO: memoify this stuff
function LoadingPlaceholderScreen(props: LoadingPlaceholderScreenProps) {
  const appConfig = useContext(AppConfigContext);
  const { width, height } = useWindowDimensions();

  const title = useMemo(() => props.title || "Loading...", [props.title]);

  const loadingPlaceholderScreenStyle = useMemo(() => {
    let style: React.CSSProperties = {
      width: props.independent
        ? width
        : width - 2 * removePx(appConfig.appPadding),
      height: props.independent
        ? height
        : height - 2 * removePx(appConfig.appPadding),
    };

    // set background color if it is an independent loader screen
    if (props.independent) style.backgroundColor = appConfig.backgroundColor;

    return style;
  }, [
    props.independent,
    appConfig.appPadding,
    appConfig.backgroundColor,
    width,
    height,
  ]);

  const titleTextElem = useMemo(
    () =>
      props.showText ? (
        <div
          style={{
            color: appConfig.themeColor,
            fontFamily: appConfig.defaultFont,
            fontWeight: 700,
            fontSize: 20,
            textAlign: "center",
            paddingTop: 15,
          }}
        >
          {title}
        </div>
      ) : null,
    [props.showText, title, appConfig.defaultFont, appConfig.themeColor]
  );

  return (
    <div
      className={styles.loadingPlaceholderScreen}
      style={loadingPlaceholderScreenStyle}
    >
      <div
        className={styles.centeredArea}
        style={{
          top: props.independent
            ? "50%" // if it is an independent component
            : `calc(50% - ${2 * removePx(appConfig.appPadding)}px`, // if it is within the authenticated layout
          left: "50%",
        }}
      >
        <div className={styles.centeredAreaInner}>
          <div className={styles.spinnerHolder}>
            <LoadingSpinner
              color={appConfig.themeColor}
              thickness="4px"
              title={title}
            />
          </div>
          {titleTextElem}
        </div>
      </div>
    </div>
  );
}

export default React.memo(LoadingPlaceholderScreen);
