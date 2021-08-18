import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// config
import { appConfig } from "../config"

// init swal
const ReactSwal = withReactContent(Swal)

const CustomSwal = ReactSwal.mixin({
  confirmButtonColor: appConfig.themeColor
})

export default CustomSwal
