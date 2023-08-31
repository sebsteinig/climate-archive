
import { Experiments, Publication } from "@/utils/types"
import { isPublication } from "@/utils/types.utils"
import PlusIcon from "$/assets/icons/plus.svg"
import EarthIcon from "$/assets/icons/earth.svg"
import { useStore } from "@/utils/store/store"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import { useRouter } from "next/navigation"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useErrorBoundary } from "react-error-boundary"
import { Loading, useLoading } from "@/utils/hooks/useLoading"
import { Spinner } from "../../loadings/LoadingSpinner"
import ExperimentsTab from "./ExperimentsTab"


type CollectionProps = {
    collection: Publication | Experiments | undefined
    load: boolean
    onClose?: { fn: () => void }
    resetSearchbar: () => void
  }

export default function CollectionDetails({
  collection,
  load,
  onClose,
  resetSearchbar,
}: CollectionProps) {
  const clear = useStore((state) => state.worlds.clear)
  const add = useStore((state) => state.worlds.add)
  const reload = useStore((state) => state.worlds.reload)
  const { showBoundary } = useErrorBoundary()
  const router = useRouter()
  const addCollection = useStore((state) => state.addCollection)
  const loading_ref = useLoading()
  if (!collection) return null

  if (!isPublication(collection)) {
    return <ExperimentsTab exps={collection.exps} />
  }
  return (
    <div className={`flex-grow h-full h-hull grid grid-cols-2`}>
      <div className="max-h-full overflow-y-auto border-r-2 border-slate-500">
        <h1 className="tracking-wide font-semibold text-center text-sky-200">
          {collection.title}
        </h1>
        <br />
        <h3 className="italic text-center  tracking-wide text-slate-400 text-sm">
          {collection.journal}, {collection.year}
        </h3>
        <h2 className="font-medium  text-center tracking-wide text-sm text-slate-400">
          {collection.authors_full}
        </h2>
        <br />
        <div className="px-5 ">
          <p className="tracking-[.5em] small-caps  font-semibold">
            Abstract :{" "}
          </p>
          <br />
          <p className="text-slate-400 tracking-wide leading-relaxed indent-10 break-words">
            {collection.abstract}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 h-full">
        <div className="self-end">
          {load && (
            <Loading ref={loading_ref} fallback={<Spinner className="m-2" />}>
              <div
                onClick={async () => {
                  loading_ref.current?.start()
                  const exp_id = collection.exps[0].id
                  try {
                    await database_provider.load({ exp_id })
                    const idx = await database_provider.addPublicationToDb(
                      collection,
                    )
                    addCollection(idx, collection)
                    add(collection, undefined, collection.exps[0])
                  } catch (e) {
                    showBoundary(e)
                    return
                  }
                  reload(false)
                  resetSearchbar()
                  router.push("/publication")
                  if (onClose) {
                    onClose.fn()
                  }
                  loading_ref.current?.finish()
                }}
                className="flex flex-row px-2 mr-5 items-center group cursor-pointer rounded-md bg-gray-800"
              >
                <span className="tracking-widest uppercase text-lg cursor-pointer px-2 text-slate-500 group-hover:text-slate-300">
                  Add world
                </span>
                <EarthIcon className="shrink-0 grow-0 w-10 h-10 cursor-pointer text-slate-500 group-hover:text-slate-300 " />
                <PlusIcon className="shrink-0 grow-0 w-14 h-14 cursor-pointer text-slate-500  group-hover:text-slate-300" />
              </div>
            </Loading>
          )}
        </div>

        <div className=" h-full overflow-hidden">
          <ExperimentsTab exps={collection.exps} />
        </div>
        <div className="flex justify-center">
          {load && (
            <Loading ref={loading_ref} fallback={<Spinner className="m-2" />}>
              <ButtonPrimary
                onClick={async () => {
                  clear()
                  loading_ref.current?.start()
                  const exp_id = collection.exps[0].id
                  try {
                    await database_provider.load({ exp_id })
                    const idx = await database_provider.addPublicationToDb(
                      collection,
                    )
                    addCollection(idx, collection)
                    add(collection, undefined, collection.exps[0])
                  } catch (e) {
                    showBoundary(e)
                    return
                  }
                  reload(false)
                  resetSearchbar()
                  router.push("/publication")
                  if (onClose) {
                    onClose.fn()
                  }
                  loading_ref.current?.finish()
                }}
              >
                Discover
              </ButtonPrimary>
            </Loading>
          )}
        </div>
      </div>
    </div>
  )
}