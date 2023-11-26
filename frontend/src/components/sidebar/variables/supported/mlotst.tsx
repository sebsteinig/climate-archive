import { Variable } from "../Variable"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Mlotst({}: Props) {
  const mlotst = useStore((state) => state.variables.mlotst)
  return <></>
}
