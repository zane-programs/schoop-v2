import React, { ReactNode, useContext, useCallback } from "react";

// context
import SideBarContext from "../../context/SideBarContext";

// styles
import styles from "./AppSubcontainer.module.css";

interface AppSubcontainerProps {
  children: ReactNode;
}

export default function AppSubcontainer({ children }: AppSubcontainerProps) {
  const sideBar = useContext(SideBarContext);

  const handleClick = useCallback(
    function handleClick() {
      requestAnimationFrame(() => {
        if (sideBar.isVisible && sideBar.setVisibility) {
          // if sidebar is visible
          sideBar.setVisibility(false);
        }
      });
    },
    [sideBar]
  );

  return (
    <div
      className={
        sideBar.isVisible
          ? `${styles.appSubcontainer} ${styles.obscured}`
          : styles.appSubcontainer
      }
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
