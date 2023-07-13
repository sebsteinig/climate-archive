import { Variable } from "../utils"
import Image from 'next/image';
import MountainIcon from "$/assets/icons/mountain-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

type Props = {
}

export function Sic({}:Props) {
    const sic = useClusterStore((state) => state.variables.sic)
    return (
        <Variable title = {"Sic"} toggle = {() => sic.toggle()}
        src={MountainIcon} active = {sic.active}  controls = {false}>
            <div>
            </div>
        </Variable> 
    )
}