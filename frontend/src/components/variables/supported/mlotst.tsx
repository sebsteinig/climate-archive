import { Variable } from "../utils"
import Image from 'next/image';
import MountainIcon from "$/assets/icons/mountain-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

type Props = {
}

export function Mlotst({}:Props) {
    const mlotst = useClusterStore((state) => state.variables.mlotst)
    return (
        <Variable title = {"Mlotst"} toggle={() => mlotst.toggle()}
        src = {MountainIcon} active = {mlotst.active} controls = {false}>
            <div >
                
            </div>
        </Variable> 
    )
}