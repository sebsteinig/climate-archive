import { useClusterStore } from "@/utils/store/cluster.store"
import DuplicateIcon from "$/assets/icons/duplicate-slate-500.svg"
import ArrowUpIcon from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDownIcon from "$/assets/icons/arrow-down-emerald-400.svg"
import WorldIcon from "$/assets/icons/world.svg"
import ScreenshotIcon from "$/assets/icons/screenshot.svg"
import RotateIcon from "$/assets/icons/rotate.svg"
import RecenterIcon from "$/assets/icons/recenter.svg"
import FullScreenIcon from "$/assets/icons/screenfull.svg"
import GridIcon from "$/assets/icons/grid.svg"
import ChangeExpIcon from "$/assets/icons/change-exp.svg"
import LinkIcon from "$/assets/icons/link.svg"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import CameraIcon from "$/assets/icons/camera.svg"
import PinIcon from "$/assets/icons/place.svg"
import { PropsWithChildren, forwardRef, useMemo, useState } from "react"
import { ViewCollection } from "@/components/sidebar/utils/CollectionDetails"
import InfoIcon from "$/assets/icons/info.svg"
import { isPublication } from "@/utils/types.utils"
import Select from "@/components/inputs/Select"

type Props = {
  className?: string
  time_idx: number
  collection_idx: number
}

export const Container = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function Container({ time_idx, collection_idx, className, children }, ref) {
    const pauseAll = useClusterStore((state) => state.time.pauseAll)
    const addUnsync = useClusterStore((state) => state.time.addUnSync)
    const remove = useClusterStore((state) => state.time.remove)
    const [display_collection_details, displayCollectionDetails] = useState(false)
    const time = useClusterStore((state) => state.time.slots.map.get(time_idx))
    const [display_buttons, displayButtons] = useState(false)
    const [display_exps, displayExps] = useState(false)
    const collection = useClusterStore((state) => state.collections.get(collection_idx))
    return (
      <div className={`relative w-full h-full ${className ?? ""}`} ref={ref}>
        {children}

        {display_collection_details && <ViewCollection displayCollectionDetails={displayCollectionDetails} collection_idx={collection_idx}/>}
        {(collection && isPublication(collection)) && <p className="absolute bottom-0 left-0 italic p-2 text-slate-400 text-sm">
            {collection.authors_short}, {collection.year}
        </p>}
        <CrossIcon
          className="absolute top-0 right-0 w-10 h-10 cursor-pointer text-slate-500 hover:tex-slate-300"
          onClick={() => remove(time_idx,collection_idx)}
        />
        {display_exps && <div className="absolute z-30 bottom-3 right-24">
          <Select onChange={() => {displayExps(false)} }>
            {collection?.exps.map((e) => <option key={e.id}>{e.id}</option>)}
          </Select>
        </div>}
        <div
          className={`absolute z-30 group bottom-0 right-0 bg-gray-900 border-gray-700 border-2
         rounded-full p-2 m-2 grid grid-cols-1 justify-items-center`}
        >
          {display_buttons && (
            <PanelConfiguration
              time_idx={time_idx}
              displayExps={displayExps}
              collection_idx={collection_idx}
              displayButtons={displayButtons}
            />
          )}

          {!display_buttons && (
            <ArrowUpIcon
              className="p-2 hidden w-10 h-10 cursor-pointer text-align:center group-hover:block text-slate-500 child:fill-slate-500"
              onClick={() => displayButtons(true)}
            />
          )}

          <DuplicateIcon
            className="w-10 h-10 cursor-pointer p-2 text-slate-500"
            onClick={() => {
              pauseAll()
              addUnsync(collection_idx, { ...time })
            }}
          />

          <InfoIcon
            className="w-10 h-10 cursor-pointer p-2 text-slate-500"
            onClick={() => displayCollectionDetails((prev) => !prev)}
          />

        </div>
      </div>
    )
  },
)

type ConfProps = {
  displayButtons: (bool: boolean) => void
  displayExps: Function
  time_idx: number
  collection_idx: number
}

function PanelConfiguration({
  time_idx,
  collection_idx,
  displayButtons,
  displayExps
}: ConfProps) {
  const time_slots = useClusterStore((state) => state.time.slots.map)
  const conf = useMemo(() => {
    return time_slots.get(time_idx)!.collections.get(collection_idx)!
  }, [time_slots])
  const [as_planet, setAsPlanet] = useState(true)
  const linkCamera = useClusterStore((state) => state.time.linkCamera)
  return (
    <div
      className="grid grid-cols-1 gap-1 justify-items-center "
    >
      <ArrowDownIcon
        className="p-2 w-10 h-10 cursor-pointer text-slate-500 child:fill-slate-500"
        onClick={() => displayButtons(false)}
      />

      {/* <div className="grid grid-cols-2 items-center p-2">
        <LinkIcon className="cursor-pointer w-4 h-4"
          onClick={() => null}
          /> */}
      {/* </div> */}
        
      
      <CameraIcon
        className={`cursor-pointer w-5 h-5 my-2 ${conf.camera.is_linked ? "text-slate-500":"text-slate-300"}`}
        onClick={() => {
          linkCamera(time_idx, collection_idx, !conf.camera.is_linked)
        }}
      />

      <RecenterIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-500 child:fill-slate-500`}
      />

      <FullScreenIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-500 child:fill-slate-500`}
      />

      <ScreenshotIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-500 child:fill-slate-500 `}
      />

      <WorldIcon
        className={`cursor-pointer w-6 h-6 my-2 
        ${
          as_planet
            ? "text-emerald-400 child:fill-emerald-400"
            : "text-slate-500 child:fill-slate-500"
        }`}
        onClick={() => setAsPlanet((prev) => !prev)}
      />

      <RotateIcon
        className={`w-7 h-7 my-2 text-slate-500 child:fill-slate-500
        ${as_planet ? "cursor-pointer" : "opacity-70"}`}
      />

      <GridIcon className={`cursor-pointer w-6 h-6 my-2 text-slate-500`} />

      <PinIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-500 child:fill-slate-500`}
      />

      <ChangeExpIcon 
        className={`cursor-pointer w-8 h-8 my-2`} 
        onClick={()=> displayExps((prev:boolean) => !prev)}
      />
    </div>
  )
}
