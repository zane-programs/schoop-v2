import React, { useEffect, useMemo } from "react";
import useSWR from "swr";

// components
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";
// import { SetupLoadingOverlay } from "../Setup";

// hooks
import usePageTitle from "../../hooks/usePageTitle";

// util
import schoopInfoAPIFetcher from "../../util/schoopInfoAPIFetcher";
import NewTabLink from "../../components/NewTabLink";

// context
// import { AuthenticatedLayoutContext } from "../../App";

interface WWResourceItemInterface {
  name: string;
  description: string;
  link: string;
}

export default function WWResources() {
  // const layout = useContext(AuthenticatedLayoutContext);
  const { setTitle } = usePageTitle();
  const { data, error } = useSWR("/tabs/resources", schoopInfoAPIFetcher);

  const wwResourceList = useMemo(
    () => data as WWResourceItemInterface[],
    [data]
  );

  useEffect(() => {
    setTitle("WW Resources");
  }, [setTitle]);

  // might just strip this out entirely for now
  // useEffect(() => {
  //   layout.setTransparentLoadingOverlayVisibility(data && isValidating);
  // }, [layout, data, isValidating]);

  if (error) return <div>Error Fetching Data</div>; // SetupLoadingOverlay
  if (!data)
    return <LoadingPlaceholderScreen title="Loading Windward Resources..." />;

  return (
    <div style={{ position: "relative" }}>
      <h1 className="mainHeading">Windward Resources</h1>
      <p>
        This page is currently under construction. Thank you for your patience!
      </p>
      <ul>
        {wwResourceList.map((resourceItem) => (
          <WWResourceItem
            item={resourceItem}
            key={resourceItem.name + "_" + resourceItem.link}
          />
        ))}
      </ul>
    </div>
  );
}

interface WWResourceItemProps {
  item: WWResourceItemInterface;
}
function WWResourceItem({ item }: WWResourceItemProps) {
  return (
    <li>
      <NewTabLink href={item.link}>
        <strong>{item.name}</strong> &ndash; {item.description}
      </NewTabLink>
    </li>
  );
}
