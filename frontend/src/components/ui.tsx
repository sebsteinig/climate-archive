'use client'
import { SearchTexture } from "@/utils/texture_provider/texture_provider.types";
import { createContext, useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import TestImage from "./TestImage";

const TextureContext = createContext<SearchTexture[]>([])

export default function UI() {
    const [states,setStates] = useState<SearchTexture[]>([])
    return (
        <TextureContext.Provider value={states}>
            <SearchBar setStates={(res) => {
            console.log(res);
            
            setStates((prev) => {
                return [...prev,...res.flat()]
            })
            }}/>
            <TestImage context={TextureContext}/>
        </TextureContext.Provider>
    )
  }
  