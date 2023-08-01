"use client"

import ArrowLeft from "$/assets/icons/arrow-left.svg"
import ButtonPrimary from "../../buttons/ButtonPrimary"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Publication } from "../../../utils/types"
import { TimeMode } from "@/utils/store/time/time.type"
import { CollectionDetails } from "../utils/CollectionDetails"

type Props =  {
  publication : Publication
  setDisplaySeeDetails: Function
  setSearchBarVisible: Function
}

export default function PublicationDetails({
   publication,
  setDisplaySeeDetails,
  setSearchBarVisible,
}: Props) {
  const add = useClusterStore((state) => state.time.add)
  
  const addCollection = useClusterStore((state) => state.addCollection)

  return (
    <div className="border-s-4 flex flex-wrap gap-2 border-sky-700 mt-2 mb-2 pl-4">
      <ArrowLeft
        className="w-4 h-4 cursor-pointer text-emerald-400 child:fill-emerald-400"
        onClick={() => setDisplaySeeDetails(false)}
      />
      <CollectionDetails collection={publication}>
        <ButtonPrimary
          onClick={async () => {
            setSearchBarVisible(false)
            const request = {
              exp_ids: publication.exps.map((e) => e.id),
            }
            await database_provider.loadAll({
              exp_ids: request.exp_ids,
            })
            const idx = await database_provider.addCollectionToDb(publication)
            addCollection(idx, publication)
            add( publication )
          }}
        >
          Load
        </ButtonPrimary>
      </CollectionDetails>
    </div>
  )
}
