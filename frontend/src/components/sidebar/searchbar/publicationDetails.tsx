"use client"

import ArrowLeft from "$/assets/icons/arrow-left.svg"
import ButtonPrimary from "../../buttons/ButtonPrimary"
import { Publication } from "../../../utils/types"
import { TimeMode } from "@/utils/store/time/time.type"
import { CollectionDetails } from "../utils/CollectionDetails"
import Link from 'next/link'

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

  return (
    <div className="border-s-4 flex flex-wrap gap-2 border-sky-700 mt-2 mb-2 pl-4">
      <ArrowLeft
        className="w-4 h-4 cursor-pointer text-emerald-400 child:fill-emerald-400"
        onClick={() => setDisplaySeeDetails(false)}
      />
      <CollectionDetails collection={publication}>
        <Link href={`/publication/${publication.authors_short.replaceAll(" ", ".")}*${publication.year}`}>
          <ButtonPrimary
            onClick={() => {/*setSearchBarVisible(false)*/}}>
            Load
          </ButtonPrimary>
        </Link>
      </CollectionDetails>
    </div>
  )
}
