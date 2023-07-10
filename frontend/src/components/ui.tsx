'use client'
import { SearchTexture } from "@/utils/texture_provider/texture_provider.types";
import { createContext, useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import TestImage from "./TestImage";

const TextureContext = createContext<SearchTexture[]>([])

type Props = {
    journals : JSX.Element
}

export default function UI({journals}:Props) {
    const [states,setStates] = useState<SearchTexture[]>([])
    return (
        <TextureContext.Provider value={states}>
            <SearchBar setStates={(res) => {
            console.log(res);
            
            setStates((prev) => {
                return [...prev,...res.flat()]
            })
            }}>
                {journals}
            </SearchBar>
            <TestImage context={TextureContext}/>
        </TextureContext.Provider>
    )
  }
  