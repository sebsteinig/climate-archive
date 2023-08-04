"use client"

import ArrowLeft from "$/assets/icons/arrow-left.svg"
import ButtonPrimary from "../../buttons/ButtonPrimary"
import { Publication } from "../../../utils/types"
import { CollectionDetails } from "../utils/CollectionDetails"
import { useRouter, useSearchParams } from 'next/navigation'

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
  const router = useRouter()
  return (
    <div className="border-s-4 flex flex-wrap gap-2 border-sky-700 mt-2 mb-2 pl-4">
      <ArrowLeft
        className="w-4 h-4 cursor-pointer text-emerald-400 child:fill-emerald-400"
        onClick={() => setDisplaySeeDetails(false)}
      />
      <CollectionDetails collection={publication}>
        <ButtonPrimary
          onClick={() => {
            setSearchBarVisible(false)
            router.push(`/publication?reload=true&${publication.authors_short.replaceAll(" ", ".")}*${publication.year}=${publication.exps[0].id}`)
          }}
        >
          Load
        </ButtonPrimary>
      </CollectionDetails>
    </div>
  )
}
