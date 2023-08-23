import { Variable } from "../utils"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Snc({}: Props) {
  const snc = useStore((state) => state.variables.snc)
  return <></>
}
