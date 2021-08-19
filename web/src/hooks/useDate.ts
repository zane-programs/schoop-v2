import { useContext } from "react";
import SpacetimeContext from "../context/SpacetimeContext";

export default function useDate() {
  const date = useContext(SpacetimeContext);
  return date;
}
