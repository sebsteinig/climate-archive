"use client"
import { WorldManager } from "./worlds_manager/WorldsManager"
import SideBar from "./sidebar/SideBar"
import { useClusterStore } from "@/utils/store/cluster.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useEffect, useState } from "react"
import SearchBar from "./searchbar/SearchBar"
import { SearchButton } from "./searchbar/SearchButton"
import { Collection } from "@/utils/store/collection.store"
import { usePathname } from "next/navigation"
import { Publication } from "@/utils/types"
import { HelpButton } from "./help/HelpButton"
import Graph from "./Graph"
import { HomeButton } from "./buttons/HomeButton"
import { CollectionView } from "./CollectionView"

type Props = {}

export default function ClientMain({}: Props) {
  // const addCollection = useClusterStore((state) => state.addCollection)
  // const add = useClusterStore((state) => state.time.add)
  // const pathname = usePathname()
  // useEffect(() => {
  //   if (!pathname.includes("publication")) {
  //     Promise.all([database_provider.loadAllColections()]).then(([e]) => {
  //       e.map((element) => {
  //         addCollection(element.id!, element.data)
  //       })
  //       const most_recent = e.sort(
  //         (a, b) => Date.parse(b.date) - Date.parse(a.date),
  //       )[0]
  //       if (most_recent) {
  //         add(most_recent.data)
  //       }
  //     })
  //   }
  // }, [])
  const [search_bar_visible, displaySearchBar] = useState(false)
  const [display_graph, displayGraph] = useState<boolean>(true)
  const [collection, setCollection] = useState<Collection | undefined>()
  const [onReturn, buildReturn] = useState<{ fn: () => void } | undefined>(
    undefined,
  )
  return (
    <>
      <div className="flex flex-row w-full h-full gap-5">
        <div className="flex flex-col gap-5">
          <div className="grow-0 ">
            <SearchButton
              search_bar_visible={search_bar_visible}
              displaySearchBar={displaySearchBar}
            />
          </div>
          <div className="flex-grow flex relative">
            <div className=" h-full flex  items-center absolute">
              <SideBar journals={<></>} />
            </div>
            <div className="absolute bottom-5 flex flex-col gap-5">
              <HelpButton />
              <HomeButton />
            </div>
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <div className="flex flex-grow-0 justify-end ">
            <SearchBar
              is_visible={search_bar_visible}
              displaySearchBar={displaySearchBar}
              displayCollection={(collection) => {
                setCollection(collection)
                displaySearchBar(false)
                buildReturn({
                  fn: () => {
                    setCollection(undefined)
                    displaySearchBar(true)
                  },
                })
              }}
            >
              {<></>}
            </SearchBar>
            {/* <div className="h-14 cursor-pointer flex items-center">
              <h1 className="">CLIMATE ARCHIVE</h1>
            </div> */}
          </div>
          <div className="overflow-y-auto flex-grow ">
            <div className="h-full">
              <div className={`h-full w-full ${collection ? "hidden" : ""}`}>
                <WorldManager
                  displayGraph={{ fn: () => displayGraph((prev) => !prev) }}
                  displayCollection={(collection) => {
                    setCollection(collection)
                  }}
                />
              </div>
              {collection && (
                <CollectionView
                  onClose={{ fn: () => setCollection(undefined) }}
                  onReturn={onReturn}
                  collection={collection}
                />
              )}
            </div>
          </div>
        </div>

        {/* <div
          className={`absolute flex flex-col top-0 right-0 z-30 w-[48%] h-full`}
        >
           {display_graph && (
            <Graph onClose={{ fn: () => displayGraph(false) }} />
          )} 
        </div> */}
      </div>
    </>
  )
}
