import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { useMemo } from "react"
import { Publication, Experiments } from "../../utils/types"
import { isPublication } from "../../utils/types.utils"
import { useClusterStore } from "@/utils/store/cluster.store"

type Props = {
  display_details: boolean
  current_details: { collection: Publication | Experiments; idx: number }
  hover: boolean
}

export function EditCollection({
  display_details,
  current_details,
  hover,
}: Props) {
  const [collections, displayCollection, hideCollection] = useClusterStore(
    (state) => [
      state.collections,
      state.displayCollection,
      state.hideCollection,
    ],
  )
  const other_collections = useMemo(
    () =>
      Array.from(collections).filter(([k, _v]) => k !== current_details.idx),
    [collections, current_details],
  )
  if (other_collections.length === 0) {
    return null
  }
  return (
    <div className="">
      {(display_details || hover) && (
        <div className="">
          <h4 className="p-3">Edit collections : </h4>
          {other_collections.map(([key, collection]) => {
            return (
              <div
                key={key}
                className="border-s-4 border-sky-300 hover:opacity-100 m-2 p-2 group opacity-80"
              >
                <p className="font-semibold text-sky-200">
                  {titleOf(collection)}
                </p>
                {isPublication(collection) && (
                  <p className="italic text-right text-slate-400">{`${collection.authors_short} (${collection.year})`}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <ButtonSecondary
                    onClick={() => {
                      hideCollection(current_details.idx)
                      displayCollection(key)
                    }}
                    className="hidden group-hover:block"
                  >
                    LOAD
                  </ButtonSecondary>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function titleOf(collection: Publication | Experiments) {
  if (isPublication(collection)) {
    return collection.title
  } else {
    return `Collection of ${collection.exps.length} Experiment
        ${collection.exps.length > 1 ? "s" : ""} : ${collection.exps[0].id}
        ${collection.exps.length > 1 ? ", ..." : ""}`
  }
}