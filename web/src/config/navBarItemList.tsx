// icons
import {
  HomeIcon,
  UserIcon,
  CommentIcon,
  GraduationCapIcon,
  // VideoIcon,
} from "react-line-awesome";

// interfaces
import NavBarItem from "../interfaces/NavBarItem";

const navBarItemList: NavBarItem[] = [
  {
    name: "Home",
    icon: <HomeIcon />,
    path: "/home",
  },
  {
    name: "Profile",
    icon: <UserIcon />,
    path: "/profile",
  },
  // {
  //   name: "Meetings",
  //   icon: <VideoIcon />,
  //   path: "/meetings",
  // },
  {
    name: "WW Resources",
    icon: <GraduationCapIcon />,
    path: "/resources",
  },
  {
    name: "Send Feedback",
    icon: <CommentIcon />,
    path: "/feedback",
  },
];

export default navBarItemList;
