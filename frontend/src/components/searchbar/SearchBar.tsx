"use client"
import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react"
import { searchPublication, useSearchPublication } from "@/utils/api/api"
import FilterPublication from "./filters/FilterPublication"
import FilterLabels from "./filters/FilterLabels"
import FilterAdvanced from "./filters/FilterAdvanced"
import { Publications } from "./publication"
import { Publication } from "../../utils/types"
import { DefaultParameter, SearchPublication } from "@/utils/api/api.types"
import SearchIcon from "$/assets/icons/magnifying-glass-emerald-400.svg"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { FullWidthSeparator, MdSeparator } from "../separators/separators"
import { PropsWithChildren } from "react"
import { Collection } from "@/utils/store/collection.store"

// function useOutsideClick(ref: HTMLDivElement, onClickOut: () => void){
//     useEffect(() => {
//         if (ref) {
//             const onClick = ({target}: any) => {
//                 if(target.parentNode && target.parentNode.parentNode && !ref.contains(target)) {
//                     !ref.contains(target) && onClickOut?.()
//                 }
//             }
//             document.addEventListener("click", onClick);
//             return () => document.removeEventListener("click", onClick);
//         }
//     }, [ref, onClickOut]);
// }

type MoreOptionsProps = {
  filter_publication : boolean
  triggerFilter : () => void
  filters: SearchPublication
  displaySearchBar: Dispatch<SetStateAction<boolean>>
  setRequestFilters: (filters: SearchPublication) => void
}

function MoreOptions({
  filters,
  filter_publication,
  triggerFilter,
  setRequestFilters,
  displaySearchBar,
  children,
}: PropsWithChildren<MoreOptionsProps>) {
  return (
    <div>
      <FilterPublication
        filters={filters}
        triggerFilter = {triggerFilter}
        setRequestFilters={setRequestFilters}
      >
        {children}
      </FilterPublication>
      <br />
      {/* <FilterLabels setRequestFilters={setRequestFilters}/> */}
      <FilterAdvanced displaySearchBar={displaySearchBar} />
      <br />
    </div>
  )
}

type Props = {
  displaySearchBar: Dispatch<SetStateAction<boolean>>
  displayCollection: (collection: Collection) => void
  is_visible: boolean
}

export default function SearchBar({
  displaySearchBar,
  displayCollection,
  is_visible,
  children,
}: PropsWithChildren<Props>) {
  const [search_panel_visible, setSearchPanelVisible] = useState(true)
  const [searched_content, setSearchContent] = useState<string>(" ")
  const search_panel_ref = useRef<HTMLDivElement>(null)
  const [publications, setPublications] = useState<Publication[]>([])
  const [display_more_options, setDisplayMoreOptions] = useState(false)
  const [filter_publication, triggerFilterPublication] = useState(false)
  const [requestFilters, setRequestFilters] = useState<SearchPublication>({})

  // useOutsideClick(search_panel_ref.current!, () => {
  //     setSearchPanelVisible(false)
  //     setSearchContent("")
  // });
  const { data, error, isLoading } = useSearchPublication({
    ...requestFilters,
    title: searched_content,
  }) ?? { data: null, error: null }

  useEffect(() => {
    let ignore = false    
    if (data) {
      setPublications(data)
    } else {
      setPublications([])
    }
    return () => {
      ignore = true
    }
  }, [searched_content, filter_publication])

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
          ${search_panel_visible && "max-sm:w-[calc(100%_-_2.5rem)]"}
          `}
        ref={search_panel_ref}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <CrossIcon
          className={`shrink-0 grow-0 w-8 h-8 absolute top-0 right-0 m-5 text-emerald-400 cursor-pointer`}
          onClick={() => {
            setSearchContent("")
            displaySearchBar(false)
          }}
        />
        <SearchIcon
          className={`shrink-0 grow-0 w-8 h-8 lg:invisible text-emerald-400 lg:hidden ${
            search_panel_visible ? "hidden" : ""
          }`}
        />

        <input
          className={`${search_panel_visible ? "max-sm:block" : "max-sm:hidden"}
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
          onClick={() => setSearchPanelVisible(true)}
        />
        <FullWidthSeparator className="mb-2" />
        <div className="overflow-y-auto overflow-x-hidden max-h-[64vh]">
          {search_panel_visible && (
            <>
              <div className="block text-end">
                <p
                  className="text-right text-emerald-300 inline-flex cursor-pointer"
                  onClick={() => {
                    setDisplayMoreOptions((prev) => !prev)
                  }}
                >
                  More options{" "}
                  {display_more_options ? (
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

              {display_more_options && (
                <MoreOptions
                  filter_publication = {filter_publication}
                  triggerFilter = {() => {
                    triggerFilterPublication((prev) => !prev)
                    setSearchContent(" ")
                  }}
                  displaySearchBar={displaySearchBar}
                  filters={requestFilters}
                  setRequestFilters={(filters: SearchPublication) => {
                    setRequestFilters((prev) => {
                      return {
                        ...prev,
                        ...filters,
                      }
                    })
                  }}
                >
                  {children}
                </MoreOptions>
              )}
              {publications.length > 0 && (
                <>
                  {display_more_options && (
                    <FullWidthSeparator className="my-3" />
                  )}
                  <p className="text-slate-400">
                    {`${publications.length} result${
                      publications.length > 1 ? "s" : ""
                    } ...`}
                  </p>
                  <br />
                </>
              )}
            </>
          )}
          {search_panel_visible && (
            <Publications
              displayCollection={displayCollection}
              publications={publications}
            />
          )}
        </div>
      </div>
    </div>
  )
}
