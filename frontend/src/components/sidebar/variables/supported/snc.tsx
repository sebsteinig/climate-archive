import { Variable } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {}

export function Snc({}: Props) {
  const snc = useClusterStore((state) => state.variables.snc)
  return <></>
}
