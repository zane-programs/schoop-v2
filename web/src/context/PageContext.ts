import { createContext } from "react";

interface PageContextConfig {
  title: string | null;
  setTitle: Function;
  isInitialLoad: boolean;
  setIsInitialLoad: Function;
}

const initialPageContext: PageContextConfig = {
  title: null,
  setTitle: () => {},
  isInitialLoad: true,
  setIsInitialLoad: () => {},
};

const PageContext = createContext(initialPageContext);

export default PageContext;
