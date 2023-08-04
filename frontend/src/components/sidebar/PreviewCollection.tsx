import { useEffect, useState } from "react"
import { useClusterStore } from "@/utils/store/cluster.store"
import DotsIcon from "$/assets/icons/dots-slate-500.svg"
import ArrowDown from "$/assets/icons/arrow-down-gray-50.svg"
import ArrowUp from "$/assets/icons/arrow-up-gray-50.svg"

import { EditCollection } from "./EditCollection"
import { MdSeparator } from "@/components/separators/separators"
import { isPublication } from "@/utils/types.utils"
import { Experiment, Experiments, Publication } from "@/utils/types"
import { TimeMode } from "@/utils/store/time/time.type"
import { CollectionDetails } from "../ViewCollection"


// type Props = {
//   display_details: boolean
//   setDisplayDetails: Function
//   setCurrentVariableControls: Function
//   search_bar_visible: boolean
// }

// export function PreviewCollection({
//   search_bar_visible,
//   display_details,
//   setDisplayDetails,
//   setCurrentVariableControls,
// }: Props) {
//   const collections = useClusterStore((state) => state.collections)
//   const binder = useClusterStore((state) => state.time.slots.lookup)

//   const [display_all, displayAll] = useState(false)
//   return (
//     <div
//       className={`bg-gray-900 mt-3 rounded-md 
//                             ${ !display_all
//                                 ? "h-fit w-fit p-2"
//                                 : ""
//                             }
//                             ${search_bar_visible ? "hidden" : ""}`}
//     >
//      {!display_all && <DotsIcon
//         onClick={() => displayAll((prev) => !prev)}
//         className="w-12 h-12 cursor-pointer px-2 text-slate-500"
//         />}
//       <div className="max-w-full overflow-y-auto overflow-x-hidden max-h-[80vh]">
//         {display_all &&
//           Array.from(binder).map((value, idx) => {
//             return (
//               <div key={idx}>
//                 <OneCollection
//                   onClick={() =>
//                     setDisplayDetails((prev: boolean) => {
//                       setCurrentVariableControls(undefined)
//                       return !prev
//                     })
//                   }
//                   current_details={{
//                     collection: collections.get(value[0]),
//                     idx: value[0],
//                   }}
//                   display_details={display_details}
//                 />
//                 {binder.size > 1 && (
//                   <MdSeparator className="ml-3 block self-center" />
//                 )}
//               </div>
//             )
//           })}
//       </div>
//     </div>
//   )

//   //no current publication or collection yet
//   return <></>
// }

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

        {display_details && <CollectionDetails collection={current_details.collection}/>}

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
            {display_details ? (
              <ArrowUp className="w-4 h-4 cursor-pointer text-slate-500 child:fill-slate-500" />
            ) : (
              <ArrowDown className="w-4 h-4 cursor-pointer text-slate-500 child:fill-slate-500" />
            )}

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
              Collection of {current_details.collection.exps.length} Experiment
              {current_details.collection.exps.length > 1 ? "s" : ""} :{" "}
              {current_details.collection.exps[0].id}
              {current_details.collection.exps.length > 1 ? ", ..." : ""}
            </p>
            {display_details ? (
              <ArrowUp className="w-4 h-4 cursor-pointer text-slate-500 child:fill-slate-500" />
            ) : (
              <ArrowDown className="w-4 h-4 cursor-pointer text-slate-500 child:fill-slate-500" />
            )}
          </>
        )}
    </div>
  )
}