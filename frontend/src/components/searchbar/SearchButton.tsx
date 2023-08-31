"use client"
import SearchIcon from "$/assets/icons/magnifying-glass-slate-500.svg"
import { Dispatch, SetStateAction, useState } from "react"
import SearchBar from "./SearchBar"
import { Collection } from "@/utils/store/collection/collection.store"
import { isPublication } from "@/utils/types.utils"
import { upPush } from "@/utils/URL_params/url_params.utils"

type Props = {
  displayCollection?: (
    collection: Collection,
    display: (display: boolean) => void,
  ) => void
}

export function SearchButton({ displayCollection }: Props) {
  const [search_bar_visible, displaySearchBar] = useState(false)
  return (
    <>
      <div
        className={` bg-gray-900 rounded-lg shadow-lg shadow-slate-950
            p-2 h-fit w-fit`}
        onClick={() => displaySearchBar((prev: boolean) => !prev)}
      >
        <SearchIcon
          className={`shrink-0 grow-0 w-10 h-10 cursor-pointer ${
            search_bar_visible
              ? "text-emerald-400 child:fill-emerald-400"
              : "text-slate-300 child:fill-slate-300"
          }`}
        />
      </div>
      <SearchBar
        is_visible={search_bar_visible}
        displaySearchBar={displaySearchBar}
        displayCollection={(collection) => {
          if (displayCollection === undefined) {
            const search_params = new URLSearchParams()
            if (isPublication(collection)) {
              upPush(search_params, {
                authors_short: collection.authors_short,
                year: collection.year,
                exp_id: collection.exps[0].id,
              })
              window.location.replace(
                "/publication/?" + search_params.toString(),
              )
            }
          } else {
            displayCollection(collection, (display) =>
              displaySearchBar(display),
            )
          }
        }}
      />
    </>
  )
}
