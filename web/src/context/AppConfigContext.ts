import { createContext } from "react";

// default config
import { appConfig } from "../config";

const AppConfigContext = createContext(appConfig);

export default AppConfigContext;
