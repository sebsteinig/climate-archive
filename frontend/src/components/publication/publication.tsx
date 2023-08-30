import { Publication } from "../../utils/types"
import { Collection } from "@/utils/store/collection/collection.store"

type Props = {
  publications: Publication[]
  displayCollection: (collection: Collection) => void
}

export function Publications({ publications, displayCollection }: Props) {
  return (
    <div>
        {publications.length > 0 &&
          publications.map((publication: Publication, idx: number) => {
            return (
              <div
                key={idx}
                className="border-s-4 border-sky-300 group mb-2 p-5 cursor-pointer 
                            rounded-r-lg
                            transition-all duration-300 hover:bg-slate-800  hover:shadow-lg shadow-slate-950
                            hover:opacity-100 opacity-80"
                onClick={() => {
                  displayCollection(publication)
                }}
              >
                <p className="tracking-[.2em] font-medium text-sky-200">
                  {publication.title}
                </p>
                <p className="italic text-right text-slate-400">{`${publication.authors_short} (${publication.year})`}</p>
              </div>
            )
          })}
    </div>
  )
}
