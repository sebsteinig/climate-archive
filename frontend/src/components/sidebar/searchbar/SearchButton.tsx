import SearchIcon from "$/assets/icons/magnifying-glass-slate-500.svg"

type Props = {
  search_bar_visible: boolean
  setSearchBarVisible: Function
}

export function SearchButton({
  search_bar_visible,
  setSearchBarVisible,
}: Props) {
  return (
    <div>
      <div className="h-1/6 flex flex-row mb-16 gap-5">
        <div className={` bg-gray-900 rounded-lg p-2 h-fit w-fit`}>
          <SearchIcon
            className={`w-10 h-10 cursor-pointer px-1 ${
              search_bar_visible ? "text-emerald-400 child:fill-emerald-400" : "text-slate-500 child:fill-slate-500"
            }`}
            onClick={() => setSearchBarVisible((prev: boolean) => !prev)}
          />
        </div>
      </div>
    </div>
  )
}
