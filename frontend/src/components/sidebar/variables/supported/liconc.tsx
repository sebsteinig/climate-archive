import { Variable } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {}

export function Liconc({}: Props) {
  const liconc = useClusterStore((state) => state.variables.liconc)
  return <></>
}
