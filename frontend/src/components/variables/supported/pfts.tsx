import { Variable } from "../utils"
import TreesIcon from "$/assets/icons/trees-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

type Props = {
}

export function Pfts({}:Props) {
    const pfts = useClusterStore((state) => state.variables.pfts)
    return (
        <Variable title = {"Vegetation"} toggle={() => pfts.toggle()}
        src = {TreesIcon} active = {pfts.active}  controls = {false}>
            <div >
                
            </div>
        </Variable> 
    )
}