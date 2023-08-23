import { Variable } from "../utils"
import MountainIcon from "$/assets/icons/mountain-slate-500.svg"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Tas({}: Props) {
  const tas = useStore((state) => state.variables.tas)
  return <></>
}
