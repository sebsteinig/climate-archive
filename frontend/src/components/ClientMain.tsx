"use client"
import { WorldManager } from "./worlds_manager/WorldsManager"
import SideBar from "./sidebar/SideBar"
import { useState } from "react"
import SearchBar from "./searchbar/SearchBar"
import { SearchButton } from "./searchbar/SearchButton"
import { Collection } from "@/utils/store/collection/collection.store"
import { HelpButton } from "./help/HelpButton"
import GraphsManager from "./graphs_manager/GraphsManager"
import { HomeButton } from "./buttons/HomeButton"
import { CollectionView } from "./publication/CollectionView"

type Props = {}

export default function ClientMain({}: Props) {
  const [collection, setCollection] = useState<Collection | undefined>()
  const [onReturn, buildReturn] = useState<{ fn: () => void } | undefined>(
    undefined,
  )

  return (
    <>
      <div className="flex flex-row w-full h-full gap-5">
        <div className="flex flex-col justify-between gap-5 h-full">
          <div className="grow-0">
            <SearchButton
              displayCollection={(collection, display) => {
                setCollection(collection)
                display(false)
                buildReturn({
                  fn: () => {
                    setCollection(undefined)
                    display(true)
                  },
                })
              }}
            />
          </div>
          <div className=" relative basis-[61%]">
            <div className="absolute top-0  h-full flex items-center z-40">
              <SideBar />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <HelpButton />
            <HomeButton />
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <div className="overflow-y-auto flex-grow ">
            <div className="h-full">
              <div className={`h-full w-full ${collection ? "hidden" : ""}`}>
                <WorldManager
                  displayCollection={(collection) => {
                    setCollection(collection)
                  }}
                />
              </div>
              {collection && (
                <CollectionView
                  resetSearchbar={() => {
                    buildReturn(undefined)
                  }}
                  onClose={{ fn: () => setCollection(undefined) }}
                  onReturn={onReturn}
                  collection={collection}
                />
              )}
            </div>
          </div>
        </div>
        <GraphsManager />
      </div>
    </>
  )
}
