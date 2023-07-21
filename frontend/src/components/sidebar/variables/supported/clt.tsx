import { useClusterStore } from "@/utils/store/cluster.store"
import { Variable } from "../utils"
import WindsIcon from "$/assets/icons/winds-slate-500.svg";


type Props = {

}

export function Clt(props:Props) {
    const clt = useClusterStore((state) => state.variables.clt)
    return (
        <></> 
    )
}