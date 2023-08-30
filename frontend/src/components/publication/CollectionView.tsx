import { Experiment, Experiments, Publication } from "@/utils/types"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import { useMemo, useState } from "react"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import PlusIcon from "$/assets/icons/plus.svg"
import EarthIcon from "$/assets/icons/earth.svg"
import LeftPage from "$/assets/icons/left-page.svg"
import RightPage from "$/assets/icons/right-page.svg"
import FirstPage from "$/assets/icons/first-page.svg"
import LastPage from "$/assets/icons/last-page.svg"
import { Collection } from "@/utils/store/collection/collection.store"
import ArrowLeft from "$/assets/icons/arrow-left.svg"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import { useRouter, useSearchParams } from "next/navigation"
import { upPush } from "@/utils/URL_params/url_params.utils"
import { useStore } from "@/utils/store/store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useErrorBoundary } from "react-error-boundary"
import { Loading, useLoading } from "@/utils/hooks/useLoading"
import {Spinner} from "../loadings/LoadingSpinner"

type Props = {
  collection: Collection
  onClose?: { fn: () => void }
  onReturn?: { fn: () => void }
  resetSearchbar : () => void
}

export function CollectionView({ collection, onClose, onReturn, resetSearchbar }: Props) {
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

type CollectionProps = {
  collection: Publication | Experiments | undefined
  load: boolean
  onClose?: { fn: () => void }
  resetSearchbar : () => void
}

export function CollectionDetails({
  collection,
  load,
  onClose,
  resetSearchbar
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
        {load && 
          <Loading ref={loading_ref} fallback={<Spinner className="m-2"/>}>
            <div onClick={async () => {
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
              }} className="flex flex-row px-2 mr-5 items-center group cursor-pointer rounded-md bg-gray-800"
            >
              <span className="tracking-widest uppercase text-lg cursor-pointer px-2 text-slate-500 group-hover:text-slate-300">
                Add world
              </span>
              <EarthIcon className="shrink-0 grow-0 w-10 h-10 cursor-pointer text-slate-500 group-hover:text-slate-300 "/>
              <PlusIcon className="shrink-0 grow-0 w-14 h-14 cursor-pointer text-slate-500  group-hover:text-slate-300"/>
            </div>
          </Loading>    
        }
        </div>

        <div className=" h-full overflow-hidden">
          <ExperimentsTab exps={collection.exps} />
        </div>
        <div className="flex justify-center">
          {load && (
            <Loading ref={loading_ref} fallback={<Spinner className="m-2"/>}>
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

function ExperimentsTab({ exps }: { exps: Experiment[] }) {
  const [slice, setSlice] = useState<{ from: number; size: number }>({
    from: 0,
    size: 10,
  })
  return (
    <div className="p-5 overflow-x-hidden rounded-lg h-full flex flex-col ">
      <div className="flex-grow ">
        <table className="w-full table-fixed border-collapse" id="exps-table">
          <thead className="text-left bg-slate-700">
            <tr className="rounded-lg">
              <th
                scope="col"
                className="truncate px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700"
              >
                Experiments
              </th>
              <th
                scope="col"
                className="truncate px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700 "
              >
                Age
              </th>
            </tr>
          </thead>
          <tbody className="overflow-hidden">
            {exps.length > 0 &&
              exps.slice(slice.from, slice.from + slice.size).map((exp) => {
                const { id, label } = getTitleOfExp(exp)
                return (
                  <tr
                    title={`${id} | ${label}`}
                    className="w-full  tracking-widest font-normal text-md border-b border-slate-500 hover:bg-slate-800"
                    key={exp.id}
                  >
                    <td className="truncate border px-10 py-3 font-medium border-slate-800">
                      {id}
                    </td>
                    <td className="truncate border px-10 py-3 font-medium border-slate-800">
                      {label}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className="justify-between mt-5 flex flex-row">
        <div className="ml-5 tracking-[.5em] small-caps opacity-70 cursor-default">
          {exps.length} Experiment{exps.length > 1 ? "s" : ""}
        </div>
        <div className=" flex flex-row">
          <FirstPage
            className="cursor-pointer mx-5 w-5 h-5"
            onClick={() => {
              setSlice((prev) => {
                return { ...prev, from: 0 }
              })
            }}
          />
          <LeftPage
            className="cursor-pointer mx-5 w-5 h-5"
            onClick={() => {
              setSlice((prev) => {
                const nfrom = Math.max(prev.from - prev.size, 0)
                return { ...prev, from: nfrom }
              })
            }}
          />
          <div className="cursor-default">
            {Math.floor(slice.from / slice.size) + 1} of{" "}
            {Math.floor(exps.length / slice.size) + 1}
          </div>
          <RightPage
            className="cursor-pointer mx-5 w-5 h-5"
            onClick={() => {
              setSlice((prev) => {
                const nfrom =
                  Math.min(
                    (prev.from + prev.size) / prev.size,
                    Math.floor(exps.length / prev.size),
                  ) * prev.size
                return { ...prev, from: nfrom }
              })
            }}
          />
          <LastPage
            className="cursor-pointer mx-5 w-5 h-5"
            onClick={() => {
              setSlice((prev) => {
                const nfrom = Math.floor(exps.length / prev.size) * prev.size
                return { ...prev, from: nfrom }
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
