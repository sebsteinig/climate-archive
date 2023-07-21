import { Variable } from "../utils"
import Image from 'next/image';
import MountainIcon from "$/assets/icons/mountain-slate-500.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

type Props = {
}

export function Snc({}:Props) {
    const snc = useClusterStore((state) => state.variables.snc)
    return (
        <></>
    )
}