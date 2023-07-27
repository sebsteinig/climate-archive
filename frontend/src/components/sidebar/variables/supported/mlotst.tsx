import { Variable } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {}

export function Mlotst({}: Props) {
  const mlotst = useClusterStore((state) => state.variables.mlotst)
  return <></>
}
