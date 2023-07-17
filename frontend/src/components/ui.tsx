'use client'
import { TextureLeaf } from "@/utils/texture_provider/texture_provider.types";
import { createContext, useRef, useState } from "react";
import SearchBar from "./searchbar/SearchBar";
import TestImage from "./TestImage";
import { Variables } from "./variables/Variables";
import { TimeProvider } from "./time_provider/TimeProvider";
import TestExp from "./TestExp";

type Props = {
    journals : JSX.Element
}

export default function UI({journals}:Props) {

    return (
        <>        
            <TimeProvider />
            <Variables/> 
            <SearchBar >
                {journals}
            </SearchBar>
            {/* <TestImage/> */}
            <TestExp/>
        </>
    )
  }
  