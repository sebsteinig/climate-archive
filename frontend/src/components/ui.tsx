'use client'
import { TextureLeaf } from "@/utils/texture_provider/texture_provider.types";
import { createContext, useRef, useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import TestImage from "./TestImage";
import { Variables } from "./variables/Variables";
import { TimeSlider } from "./time_controllers/TimeSlider";
import Main from "./3D_components/Main";

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
            {/* <TestImage/> */}
            <TimeSlider />

        </>
    )
  }
  