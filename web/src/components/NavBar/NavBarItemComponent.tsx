import React from "react";
import { Link } from "react-router-dom";

// interfaces
import NavBarItem from "../../interfaces/NavBarItem";

// components
import ScreenReaderText from "../ScreenReaderText";

// styles
import styles from "./NavBar.module.css";

interface NavBarItemComponentProps {
  item: NavBarItem;
  isSelected: boolean;
}

export default function NavBarItemComponent({
  item,
  isSelected,
}: NavBarItemComponentProps) {
  // const navigate = useNavigate();

  const className = isSelected
    ? `${styles.navBarItem} ${styles.itemActive}`
    : styles.navBarItem;

  return (
    <li
      title={item.name}
      className={className}
      // onClick={() => navigate(item.path)}
      data-tip={item.name}
    >
      <Link to={item.path}>
        {item.icon}
        <ScreenReaderText>{item.name}</ScreenReaderText>
      </Link>
    </li>
  );
}
