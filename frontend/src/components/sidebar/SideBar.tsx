import { useState } from "react"
import { SearchButton } from "./searchbar/SearchButton"
import { Variables } from "./variables/Variables"
import SearchBar from "./searchbar/SearchBar"
import { VariableName } from "@/utils/store/variables/variable.types"
//import { PreviewCollection } from "./PreviewCollection"

type Props = {
  journals: JSX.Element
}

export default function SideBar({ journals }: Props) {
  const [search_bar_visible, setSearchBarVisible] = useState(false)
  const [current_data_details, setCurrentDataDetails] = useState(false)
  const [current_variable_controls, setCurrentVariableControls] =
    useState<VariableName>()
  return (
    <div>
      <div className="absolute top-0 left-0 m-5 h-full">
        <SearchButton
          search_bar_visible={search_bar_visible}
          setSearchBarVisible={setSearchBarVisible}
        />
        <Variables
          setCurrentDataDetails={setCurrentDataDetails}
          current_variable_controls={current_variable_controls}
          setCurrentVariableControls={setCurrentVariableControls}
        />
      </div>
      <div className="absolute top-0 py-2 left-28 w-5/12">
        {/* <PreviewCollection
          display_details={current_data_details}
          setCurrentVariableControls={setCurrentVariableControls}
          setDisplayDetails={setCurrentDataDetails}
          search_bar_visible={search_bar_visible}
        /> */}
      </div>
      {search_bar_visible && (
        <SearchBar setSearchBarVisible={setSearchBarVisible}>
          {journals}
        </SearchBar>
      )}
    </div>
  )
}
