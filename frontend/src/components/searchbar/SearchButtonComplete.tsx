'use client'

import { useState } from "react"
import { SearchButton } from "./SearchButton"
import SearchBar from "./SearchBar"






export function SearchButtonComplete() {
    const [search_bar_visible, displaySearchBar] = useState(false)
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
                // setCollection(collection)
                // displaySearchBar(false)
                // buildReturn({
                //   fn: () => {
                //     setCollection(undefined)
                //     displaySearchBar(true)
                //   },
                // })
              }}
            />
        </>
    )
}