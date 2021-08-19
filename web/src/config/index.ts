import navBarItemList from "./navBarItemList";
import NavBarItem from "../interfaces/NavBarItem";

export interface AppConfig {
  appName: string;
  navBarItems: NavBarItem[];
  themeColor: string;
  backgroundColor: string;
  appPadding: string | number;
  navBarHeight: string | number;
  appFooterHeight: string | number;
  defaultFont: string;
  headingFont: string;
  classColors: string[]; // colors for each period
}

export const appConfig: AppConfig = {
  appName: "Schoop",
  navBarItems: navBarItemList,
  themeColor: "#305475",
  backgroundColor: "#f4f4f4",
  appPadding: "20px",
  navBarHeight: "78px",
  appFooterHeight: "85px",
  defaultFont: `"Karla", sans-serif`,
  headingFont: `"Gilroy-ExtraBold", sans-serif`,
  classColors: [
    "#9CE87B",
    "#89BBEF",
    "#FEF486",
    "#F1D483",
    "#BABABC",
    "#B198E6",
    "#82C2E5",
    "#EE9DC2",
    "#60B2A1",
  ],
};
