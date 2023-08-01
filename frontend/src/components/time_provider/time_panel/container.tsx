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
import LinkIcon from "$/assets/icons/link.svg"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import CameraIcon from "$/assets/icons/camera.svg"
import PinIcon from "$/assets/icons/place.svg"
import { MutableRefObject, PropsWithChildren, forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"
import { TimeID, WorldData } from "@/utils/store/time/time.type"

type Props = {
  className?: string
  time_id: TimeID,
  data:WorldData,
}

export type ContainerRef = {
  track : MutableRefObject<HTMLDivElement>
}

export const Container = forwardRef<ContainerRef, PropsWithChildren<Props>>(
  function Container({ time_id, data, className, children }, ref) {
    const dup = useClusterStore((state) => state.time.dup)
    const remove = useClusterStore((state) => state.time.remove)
    const [display_buttons, displayButtons] = useState(false)

    const div_ref= useRef<HTMLDivElement>(null!)

    useImperativeHandle(ref,()=>{
      return {
        track:div_ref
      }
    })

    return (
      <div className={`relative w-full h-full ${className ?? ""}`} ref={div_ref}>
        {children}
        <CrossIcon
          className="absolute top-0 right-0 w-10 h-10 cursor-pointer text-slate-500 hover:tex-slate-300"
          onClick={() => remove(time_id)}
        />
        <div
          className={`absolute group bottom-0 right-0 bg-gray-900
         rounded-full p-2 m-2 grid grid-cols-1 justify-items-center`}
        >
          {display_buttons && (
            <PanelConfiguration
              time_id={time_id}
              data={data}
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
              dup(time_id)
            }}
          />
        </div>
      </div>
    )
  },
)

type ConfProps = {
  displayButtons: (bool: boolean) => void
  time_id: TimeID
  data: WorldData
}

function PanelConfiguration({
  time_id,
  data,
  displayButtons,
}: ConfProps) {
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
        className={`cursor-pointer w-5 h-5 my-2 ${data.conf.camera.is_linked ? "text-slate-500":"text-slate-300"}`}
        onClick={() => {
          linkCamera(time_id,!data.conf.camera.is_linked)
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
    </div>
  )
}
