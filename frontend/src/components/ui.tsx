'use client'
import TestImage from "./TestImage";
import { SearchButton } from "./searchbar/SearchButton";
import { TimeProvider } from "./time_provider/TimeProvider";
import { Variables } from "./variables/Variables";

type Props = {
    journals : JSX.Element
}

export default function UI({journals}:Props) {

    return (
        <>        
            <TimeProvider />
            <SearchButton journals={journals}/>
            <Variables/>
        </>
    )
  }
  