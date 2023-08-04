import { Dispatch, SetStateAction, useState } from "react"
import PublicationDetails from "./publicationDetails"
import ButtonSecondary from "../../buttons/ButtonSecondary"
import { Publication, Experiment } from "../../../utils/types"
import { Collection } from "@/utils/store/collection.store"

type Props = {
  publications: Publication[]
  displayCollection : (collection:Collection) => void
}

export function Publications({
  publications,
  displayCollection,
}: Props) {
    useState<Publication>()
  return (
    <div>
      <div>
        {publications.length > 0 &&
          publications.map((publication: Publication, idx: number) => {
            return (
              <div
                key={idx}
                className="border-s-4 border-sky-300 group mb-2 px-4 cursor-pointer 
                            hover:opacity-100 opacity-80"
                onClick={() => {
                  displayCollection(publication)
                }}
              >
                <p className="font-semibold text-sky-200">
                  {publication.title}
                </p>
                <p className="italic text-right text-slate-400">{`${publication.authors_short} (${publication.year})`}</p>
                <ButtonSecondary
                  className="hidden group-hover:block"
                  onClick={() => {}}
                >
                  See Details
                </ButtonSecondary>
              </div>
            )
          })}
      </div>
    </div>
  )
}
