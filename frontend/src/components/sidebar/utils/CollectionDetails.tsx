
import { useClusterStore } from "@/utils/store/cluster.store"
import { Experiment, Experiments, Publication } from "@/utils/types"
import { isPublication } from "@/utils/types.utils"
import { useState } from "react"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { PropsWithChildren } from "react"
import { Collection } from "@/utils/store/collection.store"


type Props = {
    collection : Collection
    displayCollectionDetails : (x : boolean) => void
  }
  
  export function ViewCollection({collection, displayCollectionDetails} : Props){
    return (
      <div 
        className={`bg-gray-900 
            my-10 z-40 
            fixed top-0 right-0 lg:left-1/2 lg:-translate-x-1/2
            p-2 lg:w-1/2 rounded-md`}
      >
        <div className="relative h-10 w-full">

          <CrossIcon
              className="absolute right-5 top-0 w-10 h-10 cursor-pointer text-slate-500 hover:tex-slate-300"
              onClick={() => displayCollectionDetails(false)}
              />
        </div>
        <div className={`max-w-full max-h-[80vh] overflow-y-auto overflow-x-hidden `}>
          {/* <div className="static grid grid-cols-1">
            <CrossIcon
              className="justify-self-end w-10 h-10 cursor-pointer text-slate-500 hover:tex-slate-300"
              onClick={() => displayCollectionDetails(false)}
            />
          </div> */}
          
          <CollectionDetails collection={collection}/>
        </div>
      </div>
    )
  }
  

type CollectionProps = {
    collection : Publication | Experiments | undefined
}

export function CollectionDetails({collection, children} : PropsWithChildren<CollectionProps>){
    const [display_abstract, setDisplayAbstract] = useState(false)
    if (!collection) return null;

    if(!isPublication(collection)){
        return(
            <ExperimentsTab exps={collection.exps} />
        )
    }
    return (
        <div className={`p-2`}>
            <p className="py-2 font-semibold text-center text-sky-200">
            {collection.title}
          </p>
            <p className="italic py-2 text-slate-400 text-sm">
                {collection.journal}, {collection.year}
            </p>
            <p className="font-medium tracking-wide">{collection.authors_full}</p>
            <div className="pt-2 pr-4">
                <p className="pb-1 font-semibold">Abstract : </p>
                <p>
                  {display_abstract
                    ? collection.abstract
                    : collection.abstract.slice(0, 90) + " ..."}
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
            <div className="w-full flex flex-col items-center gap-2 justify-center">
                {children}
                <ExperimentsTab exps={collection.exps} />
            </div>
    </div>
    )
}


function ExperimentsTab({ exps }: { exps: Experiment[] }) {
    return (
      <div className="py-3 px-4">
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
  