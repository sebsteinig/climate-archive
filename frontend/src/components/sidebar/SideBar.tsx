"use client"
import { useState } from "react"
import { SearchButton } from "../searchbar/SearchButton"
import { Variables } from "./variables/Variables"
import SearchBar from "../searchbar/SearchBar"
import { EVarID } from "@/utils/store/variables/variable.types"
//import { PreviewCollection } from "./PreviewCollection"

type Props = {
  journals: JSX.Element
}

export default function SideBar({ journals }: Props) {
  const [search_bar_visible, setSearchBarVisible] = useState(false)
  const [current_data_details, setCurrentDataDetails] = useState(false)
  const [current_variable_controls, setCurrentVariableControls] =
    useState<EVarID>()
  return (
    <div>
      <Variables
        setCurrentDataDetails={setCurrentDataDetails}
        current_variable_controls={current_variable_controls}
        setCurrentVariableControls={setCurrentVariableControls}
      />
    </div>
  )
}
