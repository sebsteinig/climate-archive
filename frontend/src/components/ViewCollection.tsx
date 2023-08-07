import { useClusterStore } from "@/utils/store/cluster.store"
import { Experiment, Experiments, Publication } from "@/utils/types"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import { useMemo, useState } from "react"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import LeftPage from "$/assets/icons/left-page.svg"
import RightPage from "$/assets/icons/right-page.svg"
import FirstPage from "$/assets/icons/first-page.svg"
import LastPage from "$/assets/icons/last-page.svg"
import { PropsWithChildren } from "react"
import { Collection } from "@/utils/store/collection.store"
import ArrowLeft from "$/assets/icons/arrow-left.svg"
import Link from "next/link"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import { useRouter, useSearchParams } from "next/navigation"
import { upPush } from "@/utils/URL_params/url_params.utils"

type Props = {
  collection: Collection
  onClose?: { fn: () => void }
  onReturn?: { fn: () => void }
}

export function ViewCollection({ collection, onClose, onReturn }: Props) {
  return (
    <div className="h-full">
      <div
        className={`flex flex-col bg-gray-900 
              p-5 w-full h-full rounded-lg`}
      >
        <div className="flex-grow-0 h-10 w-full">
          {!onReturn && onClose && (
            <CrossIcon
              className="w-10 h-10 cursor-pointer text-slate-500 hover:tex-slate-300"
              onClick={() => onClose.fn()}
            />
          )}
          {onReturn && (
            <ArrowLeft
              className="w-4 h-4 cursor-pointer text-emerald-400 child:fill-emerald-400"
              onClick={() => onReturn.fn()}
            />
          )}
        </div>
        <div className={`max-h-full overflow-y-auto flex flex-grow h-full`}>
          <CollectionDetails
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
}

export function CollectionDetails({ collection, load,onClose }: CollectionProps) {
  const searchParams = useSearchParams()
  const reload = useMemo(() => {
    if (!searchParams.has("reload")) return true
    return searchParams.get("reload") == "true"
  }, [searchParams])
  const router = useRouter()
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
      <div className="grid grid-rows-2 h-full">
        <div className="row-span-4 h-full overflow-hidden">
          <ExperimentsTab exps={collection.exps} />
        </div>
        <div className="row-start-5 flex justify-center">
          {load && (
              <ButtonPrimary onClick={() => {
                const search_params = new URLSearchParams()

                upPush(search_params,{
                  authors_short : collection.authors_short,
                  year : collection.year,
                  exp_id : collection.exps[0].id,
                })
                router.push("/publication/?"+search_params.toString())
                if(onClose) {
                  onClose.fn()
                } 
              }}>Discover</ButtonPrimary>
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
                className="px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700 rounded-lg"
              >
                Experiments
              </th>
              <th
                scope="col"
                className="px-10 py-3 small-caps tracking-[.5em] font-semibold text-lg border border-slate-700 rounded-lg"
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
