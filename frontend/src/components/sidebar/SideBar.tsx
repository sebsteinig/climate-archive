"use client"
import { useState } from "react"
import { SearchButton } from "../searchbar/SearchButton"
import { Variables } from "./variables/Variables"
import SearchBar from "../searchbar/SearchBar"
import { EVarID } from "@/utils/store/variables/variable.types"
//import { PreCollectionView } from "./PreCollectionView"

type Props = {
  journals: JSX.Element
}

export default function SideBar({ journals }: Props) {
  
  const [current_variable_controls, setCurrentVariableControls] =
    useState<EVarID>()
  return (
    <Variables
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={(e : EVarID) => setCurrentVariableControls(e)}
    />
  )
}
