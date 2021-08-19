import { createContext } from "react";
import spacetime from "spacetime";

// holds a spacetime object
const SpacetimeContext = createContext(spacetime.now());

export default SpacetimeContext;
