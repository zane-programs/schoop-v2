import { ReactNode } from "react";

export default interface NavBarItem {
  name: string; // name
  icon: ReactNode; // put icon element in
  path: string; // url path
}