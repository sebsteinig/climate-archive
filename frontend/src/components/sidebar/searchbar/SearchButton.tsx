import Image from "next/image"
import SearchIcon from "$/assets/icons/magnifying-glass-slate-500.svg"
import SearchGreenIcon from "$/assets/icons/magnifying-glass-emerald-400.svg"

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
      <div className="h-1/6 px-2 py-2 mt-3 flex flex-row mb-16 gap-5">
        <div className={` bg-gray-900 rounded-lg p-2 h-fit w-fit`}>
          <Image
            onClick={() => setSearchBarVisible((prev: boolean) => !prev)}
            priority
            src={search_bar_visible ? SearchGreenIcon : SearchIcon}
            className="w-12 h-12 cursor-pointer px-2"
            alt={"search"}
          />
        </div>
      </div>
    </div>
  )
}
