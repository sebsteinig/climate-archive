import { Variable } from "../Variable"
import { useStore } from "@/utils/store/store"

type Props = {}

export function Sic({}: Props) {
  const sic = useStore((state) => state.variables.sic)
  return <></>
}
