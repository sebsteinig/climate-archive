"use client"

import { useState } from "react"
import { SearchButton } from "./SearchButton"
import SearchBar from "./SearchBar"
import { upPush } from "@/utils/URL_params/url_params.utils"
import { isPublication } from "@/utils/types.utils"
import { useRouter } from "next/navigation"
import { useStore } from "@/utils/store/store"

export function SearchButtonStatic() {
  const [search_bar_visible, displaySearchBar] = useState(false)
  const router = useRouter()
  const reload = useStore((state) => state.worlds.reload)
  return (
    <>
      <SearchButton
        search_bar_visible={search_bar_visible}
        displaySearchBar={displaySearchBar}
      />
      <SearchBar
        is_visible={search_bar_visible}
        displaySearchBar={displaySearchBar}
        displayCollection={(collection) => {
          const search_params = new URLSearchParams()
          if (isPublication(collection)) {
            upPush(search_params, {
              authors_short: collection.authors_short,
              year: collection.year,
              exp_id: collection.exps[0].id,
            })
            window.location.replace("/publication/?" + search_params.toString())
          }
        }}
      />
    </>
  )
}
