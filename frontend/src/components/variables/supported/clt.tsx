import { useClusterStore } from "@/utils/store/cluster.store"
import { Variable } from "../utils"
import Image from 'next/image';
import WindsIcon from "$/assets/icons/winds-slate-500.svg";


type Props = {

}

export function Clt(props:Props) {
    const clt = useClusterStore((state) => state.variables.clt)
    return (
        <>
            <Variable onClick={() => clt.toggle()}>
                <div className="flex flex-row">
                    <Image 
                        priority
                        src={WindsIcon}
                        className="w-12 h-12 "
                        alt="Clt"
                    />
                    <div className="hidden group-hover:block">
                        Clt
                    </div>
                </div>
                <div className="hidden group-hover:block">
                    
                </div>
            </Variable> 
        </>
    )
}