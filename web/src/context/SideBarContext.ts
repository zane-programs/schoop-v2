import { createContext, Dispatch, SetStateAction } from "react"

interface SideBarContextConfig {
  isVisible: boolean
  setVisibility?: Dispatch<SetStateAction<boolean>>
}

const config: SideBarContextConfig = {
  isVisible: false
}

// holds a Date object
const SideBarContext = createContext(config)

export default SideBarContext