import { Variable } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {}

export function Sic({}: Props) {
  const sic = useClusterStore((state) => state.variables.sic)
  return <></>
}
