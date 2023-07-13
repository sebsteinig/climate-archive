import { Variable } from "../utils"
import Image from 'next/image';
import MountainIcon from "$/assets/icons/mountain-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

type Props = {
}

export function Liconc({}:Props) {
    const liconc = useClusterStore((state) => state.variables.liconc)
    return (
        <Variable title = {"Liconc"} toggle={() => liconc.toggle()}
        src = {MountainIcon} active = {liconc.active} controls = {false}>
            <div >
                
            </div>
        </Variable> 
    )
}