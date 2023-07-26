import { Variable } from "../utils"
import MountainIcon from "$/assets/icons/mountain-slate-500.svg"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {}

export function Tas({}: Props) {
  const tas = useClusterStore((state) => state.variables.tas)
  return <></>
}
