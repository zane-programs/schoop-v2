import { useContext, useEffect } from "react";
import PageContext from "../context/PageContext";

export default function usePageTitle() {
  const { title, setTitle } = useContext(PageContext);

  useEffect(() => {
    return () => {
      // set title to empty on
      // component unmount
      setTitle(null);
    };
  }, [setTitle]);

  // pass on context info
  return { title, setTitle };
}
