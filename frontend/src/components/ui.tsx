'use client'
import { TextureLeaf } from "@/utils/texture_provider/texture_provider.types";
import { createContext, useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import TestImage from "./TestImage";
import { Variables } from "./variables/Variables";

type Props = {
    journals : JSX.Element
}

export default function UI({journals}:Props) {
    const [variables, setVariables] = useState<string[]>([])
    return (
        <>        
            <Variables/>
            <SearchBar >
                {journals}
            </SearchBar>
            <TestImage/>
        </>
    )
  }
  