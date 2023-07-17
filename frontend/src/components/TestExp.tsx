import { useClusterStore } from "@/utils/store/cluster.store"
import { useState } from "react"

import {Publication} from './searchbar/publication';
import Select from "./inputs/Select";
type Props ={}

export default function LoadedExperiments({} : Props) {
    const [collections] = useClusterStore((state) => [state.collections])
    if (collections.current){
        var current : Publication = collections.current as Publication
        return(
            <div className="bg-gray-900 group w-fit py-2 px-2 rounded-md absolute bottom-1 ml-5 left-0" >
                <span className="group-hover:hidden">See Info</span>
                <div className={`hidden group-hover:block`}>
                    <h4>Current Publication :</h4>
                    <p className="font-semibold text-sky-200">{current.title}</p>
                    <p className="italic text-slate-400">{`${current.authors_short} (${current.year})`}</p>
                    <div className="flex flex-wrap">
                        <p>Loaded publications : </p>
                        <Select onChange={() => console.log("select")}>
                            {collections.store.map((collection :  ({exps: string[]} | Publication), idx) => 
                            <option key = {idx} value={"title" in collection?collection.title: "collection"+idx.toString()} >
                                {"title" in collection?collection.title: "collection " + collection.exps.map((exp) => exp + ", ").slice(0, 15)}
                            </option>)}
                        </Select>
                    </div>
                </div>
            </div>
        )
    } 
    return(<></>)
}