"use client"
import { useState, SetStateAction, Dispatch } from "react"
import { useSearchPublication } from "@/utils/api/api"
import FilterPublication from "./filters/publication/filter.publication"
import FilterAdvanced from "./filters/advanced/filter.advanced"
import { Publications } from "../publication/publication"
import { SearchPublication } from "@/utils/api/api.types"
import SearchIcon from "$/assets/icons/magnifying-glass-emerald-400.svg"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { FullWidthSeparator } from "../separators/separators"
import { PropsWithChildren } from "react"
import { Collection } from "@/utils/store/collection/collection.store"
import { useStore } from "@/utils/store/store"
import { PublicationFilters } from "@/utils/store/search/search.store"
import LoadingSpinner from "../loadings/LoadingSpinner"

type Props = {
  displaySearchBar: Dispatch<SetStateAction<boolean>>
  displayCollection: (collection: Collection) => void
  is_visible: boolean
}

export default function SearchBar({
  displaySearchBar,
  displayCollection,
  is_visible,
}: PropsWithChildren<Props>) {
  const [searched_content, setSearchContent] = useState<string>("")
  const [display_options, displayOptions] = useState(false)
  const publication_filters = useStore(state => state.search.filter.publication)
  const clearFiltersPublication =  useStore(state => state.search.clearFiltersPublication)
  const { data, error, isLoading } = useSearchPublication({
    ...buildRequest(publication_filters),
    title: searched_content,
  }) ?? { data: null, error: null }

  return (
    <div
      className={`z-40 absolute left-0 top-0 w-full h-full backdrop-blur transition-opacity duration-100 ${
        is_visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: is_visible ? "auto" : "none" }}
      onClick={() => {
        displaySearchBar(false)
      }}
    >
      <div
        className={`
          ${is_visible ? "visible" : "hidden"}
          bg-slate-900  shadow-lg shadow-slate-950
          z-50
          p-5 m-5 
          rounded-md 
          lg:w-1/2
          absolute top-0 right-0 lg:left-1/2 lg:-translate-x-1/2
          max-sm:w-[calc(100%_-_2.5rem)]
          `}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <CrossIcon
          className={`shrink-0 grow-0 w-8 h-8 absolute top-0 right-0 m-5 text-emerald-400 cursor-pointer`}
          onClick={() => {
            setSearchContent("")
            clearFiltersPublication()
            displaySearchBar(false)
          }}
        />
        {/* <SearchIcon
          className={`shrink-0 grow-0 w-8 h-8 lg:invisible text-emerald-400 lg:hidden ${
            search_panel_visible ? "hidden" : ""
          }`}
        /> */}
        {error ? 
          <>
            <div className="w-full p-5 small-caps tracking-widest bg-red-500 rounded-md text-slate-300">
              Oops! Something went wrong
            </div>
            <br/>
          </>
        : null}
        <input
          className={`max-sm:block
                      w-full
                      bg-transparent 
                      hover:placeholder:opacity-90
                      placeholder:text-emerald-300 
                      placeholder:opacity-70 
                      outline-none 
                      mb-4
                      placeholder:tracking-wider`}
          type="text"
          autoFocus
          name="searchbar"
          id="searchbar"
          placeholder="Search a publication ..."
          value={searched_content}
          onChange={(e) => setSearchContent(e.target.value)}
          // onClick={() => setSearchPanelVisible(true)}
        />
        <FullWidthSeparator className="mb-2" />
        <div className="overflow-y-auto overflow-x-hidden max-h-[64vh]">
            <>
              <div className="block text-end">
                <p
                  className="text-right text-emerald-300 inline-flex cursor-pointer"
                  onClick={() => {
                    displayOptions((prev) => !prev)
                  }}
                >
                  More options{" "}
                  {display_options ? (
                    <ArrowUp
                      className={`w-4 h-4 self-center ml-4 text-emerald-400`}
                    />
                  ) : (
                    <ArrowDown
                      className={`w-4 h-4 self-center ml-4 text-emerald-400`}
                    />
                  )}
                </p>
              </div>

              {display_options && (
                <>
                  <FilterPublication />
                  <br />
                  <FilterAdvanced displaySearchBar={displaySearchBar} />
                  <br />
                </>
              )}
              {data && data.length > 0 && (
                <>
                  {display_options && (
                    <FullWidthSeparator className="my-3" />
                  )}
                  <p className="text-slate-400">
                    {`${data.length} result${
                      data.length > 1 ? "s" : ""
                    } ...`}
                  </p>
                  <br />
                </>
              )}
            </>
            {
              isLoading ? 
              <LoadingSpinner /> : 
              <Publications
                displayCollection={displayCollection}
                publications={data ?? []}
              />
            }
        </div>
      </div>
    </div>
  )
}

function buildRequest(filters : PublicationFilters) : SearchPublication {
  let year : number[] | undefined;
  if(filters.year_span.period && 
    (filters.year_span.from !== null
      && filters.year_span.to !== null)) {
    year = [filters.year_span.from, filters.year_span.to]
  }else if(filters.year_span.to !== null) {
    year = [filters.year_span.to]
  }
  return {
    authors_short : filters.author || undefined,
    journal : filters.journal || undefined,
    year,
  }
}
