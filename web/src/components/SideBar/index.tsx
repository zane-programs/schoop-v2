import React, { useContext, useMemo } from "react";

// context
import AppConfigContext from "../../context/AppConfigContext";
import SideBarContext from "../../context/SideBarContext";

// components
import SideBarItem from "./SideBarItem";
import DummyLink from "../DummyLink";
import { SignOutAltIcon } from "react-line-awesome";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";

// auth
// import app from "../../auth/base";
import { AuthContext } from "../../auth/AuthProvider";

// styles
import styles from "./SideBar.module.css";

interface SideBarProps {
  isVisible: boolean;
}

function SideBar({ isVisible }: SideBarProps) {
  const appConfig = useContext(AppConfigContext);
  const { height } = useWindowDimensions(); // window height

  // memoized, yay
  const sideBarItems = useMemo(
    () =>
      appConfig.navBarItems.map((item) => (
        <SideBarItem item={item} key={item.path} />
      )),
    [appConfig.navBarItems]
  );

  // also memoized (for performance)
  const style = useMemo(() => {
    let style: React.CSSProperties = {
      height: `calc(env(safe-area-inset-top, 0px) + ${height}px)`,
      paddingTop: `env(safe-area-inset-top, 0px)`,
    };
    if (isVisible) {
      style.transform = "translateX(0px)";
    }
    return style;
  }, [height, isVisible]);

  // controls aria-hidden (accessibility concerns)
  const visibilityProps = useMemo(
    () => (isVisible ? {} : { "aria-hidden": true }),
    [isVisible]
  );

  return (
    <ul className={styles.sideBar} style={style} {...visibilityProps}>
      {sideBarItems}
      <SideBarLogOutItem />
    </ul>
  );
}

function SideBarLogOutItem() {
  const { isVisible, setVisibility } = useContext(SideBarContext);
  const auth = useContext(AuthContext);

  // controls tab index
  const visibilityProps = useMemo(
    () => (isVisible ? {} : { tabIndex: -1, style: { outline: "none" } }),
    [isVisible]
  );

  return (
    <li
      onTouchStart={() => {}}
      onClick={() => {
        if (setVisibility) setVisibility(false);
        auth.logOut("Sidebar"); // log out user
      }}
    >
      <DummyLink {...visibilityProps}>
        <div className={styles.icon}>
          <SignOutAltIcon />
        </div>
        <div className={styles.name}>Log Out</div>
      </DummyLink>
    </li>
  );
}

export default React.memo(SideBar);
