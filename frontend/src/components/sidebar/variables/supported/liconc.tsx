import { Variable } from "../Variable"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Liconc({}: Props) {
  const liconc = useStore((state) => state.variables.liconc)
  return <></>
}
