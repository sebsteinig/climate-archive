import SearchIcon from "$/assets/icons/magnifying-glass-slate-500.svg"
import { Dispatch, SetStateAction } from "react"

type Props = {
  search_bar_visible: boolean
  displaySearchBar: Dispatch<SetStateAction<boolean>>
}

export function SearchButton({ search_bar_visible, displaySearchBar }: Props) {
  return (
    <div>
      <div className="h-1/6 flex flex-row">
        <div className={` bg-gray-900 rounded-lg p-2 h-fit w-fit`}>
          <SearchIcon
            className={`w-10 h-10 cursor-pointer ${
              search_bar_visible
                ? "text-emerald-400 child:fill-emerald-400"
                : "text-slate-500 child:fill-slate-500"
            }`}
            onClick={() => displaySearchBar((prev: boolean) => !prev)}
          />
        </div>
      </div>
    </div>
  )
}
