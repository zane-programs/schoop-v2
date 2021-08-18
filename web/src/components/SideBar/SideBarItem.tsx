import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

// interfaces
import NavBarItem from "../../interfaces/NavBarItem";

// context
import SideBarContext from "../../context/SideBarContext";

// styles
import styles from "./SideBar.module.css";

interface SideBarItemProps {
  item: NavBarItem;
}

export default function SideBarItem({ item }: SideBarItemProps) {
  const { isVisible, setVisibility } = useContext(SideBarContext);
  const { pathname } = useLocation();
  // const navigate = useNavigate();

  function hideSidebar() {
    if (setVisibility) setVisibility(false);
  }

  // controls tab index
  const visibilityProps = isVisible
    ? {}
    : { tabIndex: -1, style: { outline: "none" } };

  // controls className for active
  const classNameProps =
    item.path === pathname ? { className: styles.activeItem } : {};

  return (
    <li
      onTouchStart={() => {}}
      onClick={() => {
        // navigate(item.path);
        hideSidebar();
      }}
      {...classNameProps}
    >
      <Link to={item.path} onClick={() => hideSidebar()} {...visibilityProps}>
        <div className={styles.icon}>{item.icon}</div>
        <div className={styles.name}>{item.name}</div>
      </Link>
    </li>
  );
}
