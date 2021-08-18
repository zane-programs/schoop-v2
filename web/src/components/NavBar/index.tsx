import React, { useContext, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

// context
import AppConfigContext from "../../context/AppConfigContext";
import SideBarContext from "../../context/SideBarContext";

// components
import NavBarItemComponent from "./NavBarItemComponent";
import ScreenReaderText from "../ScreenReaderText";
import DummyLink from "../DummyLink";
import { BarsIcon, SignOutAltIcon } from "react-line-awesome";

// interfaces
// import NavBarItem from "../../interfaces/NavBarItem";

// interface NavBarProps {
//   items: NavBarItem[];
//   currentPath: string;
// }

// hooks
import useScrollPosition from "../../hooks/useScrollPosition";
import useWindowDimensions from "../../hooks/useWindowDimensions";

// styles
import styles from "./NavBar.module.css";

// interface NavBarProps {
//   scrollPosition: number;
// }

// auth
// import app from "../../auth/base";
import { AuthContext } from "../../auth/AuthProvider";

function NavBar() {
  const windowDimensions = useWindowDimensions();
  const scrollPosition = useScrollPosition();
  const appConfig = useContext(AppConfigContext); // config context

  let navBarClassName = styles.navBar;
  if (scrollPosition > 5) navBarClassName += " " + styles.navBarScrolled;
  if (windowDimensions.width < 800) navBarClassName += " " + styles.navBarSmall;

  return (
    <>
      <ReactTooltip
        place="bottom"
        type="dark"
        effect="solid"
        className={styles.navTooltip}
      />
      <nav
        className={navBarClassName}
        style={{ backgroundColor: appConfig.themeColor }}
      >
        <div className={styles.navBarInner}>
          <SideBarButton />
          <Link to="/home" className={styles.navBarTitle}>
            <span>{appConfig.appName}</span>
          </Link>
          <NavBarButtons>
            <LogOutButton />
          </NavBarButtons>
        </div>
      </nav>
    </>
  );
}

interface NavBarButtonsProps {
  children?: React.ReactNode;
}
function NavBarButtons({ children }: NavBarButtonsProps) {
  const currentPath = useLocation().pathname; // router path
  const appConfig = useContext(AppConfigContext); // config context
  const items = appConfig.navBarItems; // navbar items

  // convert navbar items into components
  const itemElements = useMemo(
    () =>
      items.map((item) => (
        <NavBarItemComponent
          item={item}
          isSelected={currentPath === item.path}
          key={item.path}
        />
      )),
    [items, currentPath]
  );

  return (
    <div className={styles.navBarButtons}>
      <ul className={styles.navBarButtonsList}>
        {itemElements}
        {children}
      </ul>
    </div>
  );
}

function SideBarButton() {
  const { isVisible, setVisibility } = useContext(SideBarContext);

  return (
    <button
      className={styles.sideBarButton}
      onClick={() => requestAnimationFrame(() => { if (setVisibility) setVisibility(!isVisible) })}
    >
      <BarsIcon />
      <ScreenReaderText>Menu</ScreenReaderText>
    </button>
  );
}

function LogOutButton() {
  const auth = useContext(AuthContext); // auth access

  return (
    <li
      title="Log Out"
      onClick={() => auth.logOut("Navbar")}
      className={styles.navBarItem}
      // data-tip="Log Out"
    >
      <DummyLink>
        <SignOutAltIcon />
        <ScreenReaderText>Log Out</ScreenReaderText>
      </DummyLink>
    </li>
  );
}

export default React.memo(NavBar);
