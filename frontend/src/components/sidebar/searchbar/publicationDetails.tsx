"use client"
import Image from "next/image"
import ArrowLeft from "$/assets/icons/arrow-left-emerald-300.svg"
import ArrowUp from "$/assets/icons/arrow-up-gray-50.svg"
import ArrowDown from "$/assets/icons/arrow-down-gray-50.svg"
import { useState } from "react"
import Checkbox from "../../inputs/Checkbox"
import ButtonPrimary from "../../buttons/ButtonPrimary"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Publication, Experiment } from "../../../utils/types"
import { TimeMode } from "@/utils/store/time/time.type"

type Props = Publication & {
  setDisplaySeeDetails: Function
  setSearchBarVisible: Function
}

type CheckedExp = {
  exp: string
  checked: boolean
}

export default function PublicationDetails({
  title,
  journal,
  year,
  authors_full,
  authors_short,
  abstract,
  exps,
  setDisplaySeeDetails,
  setSearchBarVisible,
}: Props) {
  const [display_abstract, setDisplayAbstract] = useState(false)
  const addUnsync = useClusterStore((state) => state.time.addUnSync)
  const [checked, setChecked] = useState<CheckedExp[]>(
    exps.map((exp) => {
      return {
        exp: exp.id,
        checked: true,
      }
    }),
  )

  function selectAll(is_checked: boolean) {
    setChecked((prev) => {
      return prev.map(({ exp }) => {
        return {
          exp,
          checked: is_checked,
        }
      })
    })
  }
  const nb_checked = checked.reduce((acc, e) => acc + Number(e.checked), 0)
  const addCollection = useClusterStore((state) => 
    state.addCollection,
  )

  return (
    <>
      <div className="border-s-4 flex flex-wrap gap-2 border-sky-700 mt-2 mb-2 pl-4">
        <Image
          priority
          alt="back"
          title="back"
          className="w-4 h-4 cursor-pointer"
          src={ArrowLeft}
          onClick={() => setDisplaySeeDetails(false)}
        />

        <p className="font-semibold tracking-widest text-center pr-4 text-sky-200">
          {title}
        </p>
        <p className="italic text-slate-400 text-sm">
          {journal}, {year}
        </p>
        <p className="font-medium tracking-wide">{authors_full}</p>
        <div className="pt-2 pr-4">
          <p className="pb-1 font-semibold">Abstract : </p>
          <p>{display_abstract ? abstract : abstract.slice(0, 90) + " ..."}</p>
          <div
            className="cursor-pointer flex flex-row-reverse gap-2 items-center"
            onClick={() => {
              setDisplayAbstract((prev) => !prev)
            }}
          >
            <Image
              src={display_abstract ? ArrowUp : ArrowDown}
              priority
              alt="up"
              className="w-3 h-3"
            />
            <p className="hover:underline text-right">
              {display_abstract ? "Hide" : "Full abstract"}
            </p>
          </div>
        </div>
        <ButtonPrimary
          disabled={nb_checked === 0}
          onClick={async () => {
            setSearchBarVisible(false)
            const request = {
              exp_ids: checked.filter((e) => e.checked).map((e) => e.exp),
            }
            await database_provider.loadAll({
              exp_ids: request.exp_ids,
            })
            const collection = {
              exps: exps.filter((exp: Experiment) =>
                request.exp_ids.includes(exp.id),
              ),
              abstract,
              authors_full,
              authors_short,
              journal,
              title,
              year,
            } as Publication
            database_provider.addCollectionToDb(collection)
            addCollection(collection, (idx)=> console.log(idx))
            addUnsync(3, {
              mode: TimeMode.ts,
            })
          }}
        >
          {" "}
          {`Load ${
            nb_checked === checked.length ? "all " : ""
          } ${nb_checked} experiment${nb_checked > 1 ? "s" : ""}`}
        </ButtonPrimary>
        <div className="pt-3 pr-5">
          <div className="overflow-y-visible overflow-x-hidden max-h-52">
            <table
              className="w-11/12 table-fixed border-t-0 border"
              id="exps-table"
            >
              <thead className="border-b  text-left font-medium border-neutral-500 bg-slate-600 sticky top-0">
                <tr className="">
                  <th
                    scope="col"
                    className="border-r px-6 py-2 border-neutral-500"
                  >
                    Experiments
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-2 border-neutral-500"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-2 border-neutral-500 w-1/4"
                  >
                    <Checkbox
                      name="checked_all"
                      checked={nb_checked === checked.length}
                      onChange={(event: any) => {
                        selectAll(event.target.checked)
                      }}
                    ></Checkbox>
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {exps.length > 0 &&
                  exps.map((exp) => {
                    let label = exp.metadata[0].metadata.text
                    return (
                      <tr
                        className="w-6 border-b dark:border-neutral-500"
                        key={exp.id}
                      >
                        <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                          {exp.id}
                        </td>
                        <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                          {label}
                        </td>
                        <td className="border px-6 py-2 font-medium dark:border-neutral-500">
                          <Checkbox
                            name={title + "_" + exp.id}
                            onChange={(event: any) => {
                              setChecked((prev) => {
                                return prev.map((e) => {
                                  if (e.exp === exp.id) {
                                    return {
                                      exp: e.exp,
                                      checked: event.target.checked,
                                    }
                                  }
                                  return e
                                })
                              })
                            }}
                            checked={
                              checked.find((e) => e.exp === exp.id)?.checked ??
                              false
                            }
                          ></Checkbox>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
