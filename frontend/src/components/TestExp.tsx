import { useClusterStore } from "@/utils/store/cluster.store"

import {Publication} from './searchbar/publication';
type Props ={}

export default function LoadedExperiments({} : Props) {
    const [collections] = useClusterStore((state) => [state.collections])
    console.log(collections);
    if (collections.current){
        var current : Publication = collections.current as Publication
        return(
            <div className="bg-gray-900 w-fit py-2 px-2 rounded-md absolute bottom-24 lg:left-1/4">
                <h4>Current Publication :</h4>
                <p className="font-semibold text-sky-200">{current.title}</p>
                <p className="italic text-slate-400">{`${current.authors_short} (${current.year})`}</p>
           
            </div>
        )
    } 
    return(<></>)
}