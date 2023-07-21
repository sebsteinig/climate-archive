'use client'
import TestImage from "./TestImage";
import { TimeProvider } from "./time_provider/TimeProvider";
import SideBar from "./sidebar/SideBar";

type Props = {
    journals : JSX.Element
}

export default function UI({journals}:Props) {

    return (
        <>        
            <TimeProvider />
            <SideBar journals={journals}/>
        </>
    )
  }
  