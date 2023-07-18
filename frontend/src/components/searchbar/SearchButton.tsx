import Image from 'next/image'
import {useState} from 'react'
import SearchIcon from "$/assets/icons/magnifying-glass-slate-500.svg"
import SearchGreenIcon from "$/assets/icons/magnifying-glass-emerald-400.svg"
import SearchBar from "./SearchBar"
import { CurrentData } from './CurrentData'

type Props = {
    journals : JSX.Element
}

export function SearchButton({journals}:Props) {
    const [search_bar_visible, setSearchBarVisible] = useState(false)
    return (
        <div>
            <div className="absolute top-0 py-5 px-2 left-0 ml-5 group w-1/2 flex flex-row gap-5">
                <div className={` bg-gray-900 rounded-lg p-2 h-fit w-fit`}>
                    <Image onClick={() => setSearchBarVisible(prev => !prev)}
                        priority
                        src={search_bar_visible?SearchGreenIcon:SearchIcon}
                        className="w-12 h-12 cursor-pointer px-2"
                        alt={"search"}
                    />
                </div>
                <div className='w-5/6'>
                    <CurrentData search_bar_visible = {search_bar_visible}></CurrentData>
                </div>
            </div>
            {search_bar_visible && <SearchBar setSearchBarVisible = {setSearchBarVisible}>{journals}</SearchBar>}
        </div>
    )    
}