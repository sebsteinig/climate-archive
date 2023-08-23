import { Variable } from "../utils"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Sic({}: Props) {
  const sic = useStore((state) => state.variables.sic)
  return <></>
}
