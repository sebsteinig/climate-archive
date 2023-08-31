
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { Collection } from "@/utils/store/collection/collection.store"
import ArrowLeft from "$/assets/icons/arrow-left.svg"
import CollectionDetails from "./utils/CollectionDetails"

type Props = {
  collection: Collection
  onClose?: { fn: () => void }
  onReturn?: { fn: () => void }
  resetSearchbar: () => void
}

export function CollectionView({
  collection,
  onClose,
  onReturn,
  resetSearchbar,
}: Props) {
  return (
    <div className="h-full">
      <div
        className={`flex flex-col bg-gray-900 
              p-5 w-full h-full rounded-lg`}
      >
        <div className="flex-grow-0 h-10 w-full">
          {!onReturn && onClose && (
            <CrossIcon
              className="shrink-0 grow-0 w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-300"
              onClick={() => onClose.fn()}
            />
          )}
          {onReturn && (
            <ArrowLeft
              className="shrink-0 grow-0 w-4 h-4 cursor-pointer text-emerald-400 child:fill-emerald-400"
              onClick={() => {
                onReturn.fn()
                resetSearchbar()
              }}
            />
          )}
        </div>
        <div className={`max-h-full overflow-y-auto flex flex-grow h-full`}>
          <CollectionDetails
            resetSearchbar={resetSearchbar}
            collection={collection}
            load={onReturn !== undefined}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  )
}


