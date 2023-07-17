import Image from 'next/image';
import {useState} from 'react'
import SearchIcon from "$/assets/icons/magnifying-glass-emerald-400.svg";
import SearchBar from "./searchbar/SearchBar"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Publication } from './searchbar/publication';

type Props = {
    journals : JSX.Element
}

export function SearchButton({journals}:Props) {
    const [search_bar_visible, setSearchBarVisible] = useState(false)
    const [collections] = useClusterStore((state) => [state.collections])
    return (
        <div>
            <div className="absolute top-14 px-2 -translate-y-1/2 left-0 ml-5 group flex flex-row gap-5">
                <div className={` bg-gray-900 rounded-lg p-2 h-fit w-fit`}>
                    <Image onClick={() => setSearchBarVisible(prev => !prev)}
                        priority
                        src={SearchIcon}
                        className="w-12 h-12 px-2"
                        alt={"search"}
                    />
                </div>
                {collections.current && <div className={`bg-gray-900 w-fit rounded-md ${search_bar_visible?"opacity-30":""}`}>
                    <div className={`py-2 px-2 border-s-4 border-sky-300`}>
                        <p className="font-semibold text-sky-200">{(collections.current as Publication).title}</p>
                        <p className="italic text-right text-slate-400">
                            {`${(collections.current as Publication).authors_short} (${(collections.current as Publication).year})`}
                        </p>
                    </div>
                </div>}
            </div>
            {search_bar_visible && <SearchBar setSearchBarVisible = {setSearchBarVisible}>{journals}</SearchBar>}
        </div>
    )    
}