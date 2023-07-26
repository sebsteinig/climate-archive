import { useEffect, useState } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import Image from "next/image"
import Dots from "$/assets/icons/dots-slate-500.svg"
import ArrowDown from "$/assets/icons/arrow-down-gray-50.svg"
import ArrowUp from "$/assets/icons/arrow-up-gray-50.svg"

import { EditCollection } from "./EditCollection"
import { MdSeparator } from "@/components/separators/separators"
import { isPublication } from "@/utils/types.utils"
import { Experiment, Experiments, Publication } from "@/utils/types"
import { TimeMode } from "@/utils/store/time/time.type"

type Props = {
  display_details: boolean
  setDisplayDetails: Function
  setCurrentVariableControls: Function
  search_bar_visible: boolean
}

export function PreviewCollection({
  search_bar_visible,
  display_details,
  setDisplayDetails,
  setCurrentVariableControls,
}: Props) {
  const collections = useClusterStore((state) => state.collections)
  
  const binder = useClusterStore((state) => state.time.binder)

  
  const [display_all, displayAll] = useState(false)
  return (
    <div
      className={`bg-gray-900 mt-3 rounded-md 
                            ${
                              binder.size > 1 && !display_all
                                ? "h-fit w-fit p-2"
                                : ""
                            }
                            ${search_bar_visible ? "hidden" : ""}`}
    >
      {binder.size > 1 && (
        <Image
          onClick={() => displayAll((prev) => !prev)}
          priority
          src={Dots}
          className="w-12 h-12 cursor-pointer px-2"
          alt={"details"}
        />
      )}
      <div className="max-w-full overflow-y-auto overflow-x-hidden max-h-[80vh]">
        {(display_all || binder.size == 1) &&
          Array.from(binder).map((value, idx) => {
            return (
              <div key={idx}>
                <OneCollection
                  onClick={() =>
                    setDisplayDetails((prev: boolean) => {
                      setCurrentVariableControls(undefined)
                      return !prev
                    })
                  }
                  current_details={{
                    collection: collections.get(value[0]),
                    idx: value[0],
                  }}
                  display_details={display_details}
                />
                {binder.size > 1 && (
                  <MdSeparator className="ml-3 block self-center" />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )

  //no current publication or collection yet
  return <></>
}

type DisplayProps = {
  display_details: boolean
  onClick: Function
}

type Collection = Publication | Experiments

type OneCollectioneProps = DisplayProps & {
  current_details: { collection: Collection | undefined; idx: number }
}
function OneCollection({
  current_details,
  display_details,
  onClick,
}: OneCollectioneProps) {
  const [hover, setHover] = useState(false)
  if (current_details.collection) {
    return (
      <div
        key={current_details.idx}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${display_details && "px-2"}`}
      >
        <CurrentTitle
          onClick={onClick}
          display_details={display_details}
          current_details={{
            collection: current_details.collection,
            idx: current_details.idx,
          }}
        />

        {display_details && (
          <>
            {isPublication(current_details.collection) ? (
              <CurrentPublication publication={current_details.collection} />
            ) : (
              <ExperimentsTab exps={current_details.collection.exps} />
            )}
          </>
        )}

        <EditCollection
          display_details={display_details}
          hover={hover}
          current_details={{
            collection: current_details.collection,
            idx: current_details.idx,
          }}
        />
      </div>
    )
  }
  return null
}

type CurrentTitleProps = DisplayProps & {
  current_details: { collection: Collection; idx: number }
}
function CurrentTitle({
  current_details,
  display_details,
  onClick,
}: CurrentTitleProps) {
  return (
    <div
      onClick={() => onClick()}
      className={`${
        display_details ? "" : " border-s-4 border-sky-300"
      } m-2 cursor-pointer ${!display_details && "px-4"}`}
    >
      <div className="">
        {isPublication(current_details.collection) && (
          <div>
            <p className="py-2 font-semibold text-sky-200">
              {current_details.collection.title}
            </p>
            <div
              className={
                display_details ? "" : "flex place-content-between items-center"
              }
            >
              <Image
                src={display_details ? ArrowUp : ArrowDown}
                className="w-4 h-4 cursor-pointer"
                priority
                alt=""
              />
              {!display_details && (
                <p className="py-2 italic text-right text-slate-400">
                  {`${current_details.collection.authors_short} (${current_details.collection.year})`}
                </p>
              )}
            </div>
          </div>
        )}

        {!isPublication(current_details.collection) &&
          current_details.collection.exps.length > 0 && (
            <>
              <p className="font-semibold text-sky-200">
                Collection of {current_details.collection.exps.length}{" "}
                Experiment
                {current_details.collection.exps.length > 1 ? "s" : ""} :{" "}
                {current_details.collection.exps[0].id}
                {current_details.collection.exps.length > 1 ? ", ..." : ""}
              </p>
              <Image
                src={display_details ? ArrowUp : ArrowDown}
                className="w-4 h-4 cursor-pointer"
                priority
                alt=""
              />
            </>
          )}
      </div>
    </div>
  )
}

function CurrentPublication({ publication }: { publication: Publication }) {
  const [display_abstract, setDisplayAbstract] = useState(false)
  return (
    <div className={`p-2`}>
      <p className="italic py-2 text-slate-400 text-sm">
        {publication.journal}, {publication.year}
      </p>
      <p className="font-medium tracking-wide">{publication.authors_full}</p>
      <div className="pt-2 pr-4">
        <p className="pb-1 font-semibold">Abstract : </p>
        <p>
          {display_abstract
            ? publication.abstract
            : publication.abstract.slice(0, 90) + " ..."}
        </p>
        <div
          className="cursor-pointer hover:underline text-right"
          onClick={() => {
            setDisplayAbstract((prev) => !prev)
          }}
        >
          {display_abstract ? "Hide" : "Full abstract"}
        </div>
      </div>
      <ExperimentsTab exps={publication.exps} />
    </div>
  )
}

function ExperimentsTab({ exps }: { exps: Experiment[] }) {
  return (
    <div className="py-3 pr-5">
      <div className="overflow-y-visible overflow-x-hidden max-h-52">
        <table
          className="w-11/12 table-fixed border-t-0 border"
          id="exps-table"
        >
          <thead className="border-b  text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
            <tr className="">
              <th scope="col" className="border-r px-6 py-2 border-neutral-500">
                Experiments
              </th>
              <th scope="col" className="border-r px-6 py-2 border-neutral-500">
                Age
              </th>
            </tr>
          </thead>
          <tbody className="">
            {exps.length > 0 &&
              exps.map((exp) => {
                let label =
                  exp.metadata.length > 0 ? exp.metadata[0].metadata.text : ""
                return (
                  <tr
                    className="w-full border-b dark:border-neutral-500"
                    key={exp.id}
                  >
                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                      {exp.id}
                    </td>
                    <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                      {label}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
