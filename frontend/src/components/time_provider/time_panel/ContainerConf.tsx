import { RefObject, useState } from "react"
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
import InfoIcon from "$/assets/icons/info.svg"
import { Collection } from "@/utils/store/collection.store"
import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import Link from "next/link"
import { useClusterStore } from "@/utils/store/cluster.store"
import { gsap } from "gsap"
import { usePathname, useRouter } from "next/navigation"
import { resolveURLparams } from "@/utils/URL_params/url_params.utils"
import { SceneRef } from "./Scene"

type Props = {
  className?: string
  displayCollection: (collection: Collection) => void
  data: WorldData
  time_id: TimeID
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
}

export function ContainerConf({
  className,
  displayCollection,
  data,
  current_frame,
  time_id,
  scene_ref,
}: Props) {
  const [is_expanded, expand] = useState(false)

  return (
    <div
      className={` shadow-lg shadow-slate-950 w-fit overflow-y-auto overflow-x-hidden
      z-20 group bg-gray-900 max-h-[90%] grid grid-cols-1 place-items-center
      
      rounded-full p-2   ${className ?? ""}`}
    >
      {is_expanded ? (
        <ArrowDownIcon
          className="p-2 w-10 h-10  cursor-pointer text-align:center text-slate-400 child:fill-slate-400"
          onClick={() => expand(false)}
        />
      ) : (
        <ArrowUpIcon
          className="p-2 w-10 h-10  cursor-pointer text-align:center text-slate-400 child:fill-slate-400"
          onClick={() => expand(true)}
        />
      )}
      {is_expanded && (
        <>
          <RecenterBtn />
          <FullScreenBtn />
          <ScreenshotBtn />
          <WorldBtn
            onClick={(time_id, is_spheric) => {
              const frame = current_frame.current.get(time_id)
              if (!frame) return
              if (scene_ref.current) {
                scene_ref.current.canOrbit(is_spheric)
              }
              const to = is_spheric ? 1 : 0
              gsap.to(frame, {
                uSphereWrapAmount: to,
                duration: 1,
                ease: "none",
              })
            }}
            time_id={time_id}
          />
          <RotateBtn />
          <GridBtn />
          <PinBtn />
        </>
      )}
      <CamBtn
        onClick={(time_id, linked) => {
          if (scene_ref.current) {
            scene_ref.current.linkCamera(linked)
          }
        }}
        time_id={time_id}
      />
      <DupBtn time_id={time_id} current_frame={current_frame} />
      <InfoBtn onClick={displayCollection} collection={data.collection} />
    </div>
  )
}

type InfoBtnProps = {
  onClick: (collection: Collection) => void
  collection: Collection
}

function InfoBtn({ onClick, collection }: InfoBtnProps) {
  return (
    <InfoIcon
      className="w-12 h-12  cursor-pointer p-2 text-slate-400"
      onClick={() => {
        onClick(collection)
      }}
    />
  )
}

type DupBtnProps = {
  time_id: TimeID
  current_frame: TimeFrameRef
}

function DupBtn({ time_id, current_frame }: DupBtnProps) {
  const router = useRouter()
  const pathname = usePathname()
  const dup = useClusterStore((state) => state.time.dup)

  return (
    <DuplicateIcon
      className="w-10 h-10   cursor-pointer p-2 text-slate-400 child:fill-slate-400"
      onClick={() => {
        dup(time_id)
      }}
    />
  )
}

type CamBtnProps = {
  onClick: (id: TimeID, linked: boolean) => void
  time_id: TimeID
}

function CamBtn({ onClick, time_id }: CamBtnProps) {
  const [is_linked, link] = useState(true)
  return (
    <CameraIcon
      className={`cursor-pointer  w-5 h-5 my-2 ${
        is_linked ? "text-slate-400" : "text-emerald-400"
      }`}
      onClick={() => {
        onClick(time_id, !is_linked)
        link((prev) => !prev)
      }}
    />
  )
}

type RecenterBtnProps = {}

function RecenterBtn(params: RecenterBtnProps) {
  return (
    <RecenterIcon
      className={`cursor-pointer w-6 h-6   my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type FullScreenBtnProps = {}

function FullScreenBtn(params: FullScreenBtnProps) {
  return (
    <FullScreenIcon
      className={`cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type ScreenshotBtnProps = {}

function ScreenshotBtn(params: ScreenshotBtnProps) {
  return (
    <ScreenshotIcon
      className={`cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400 `}
    />
  )
}

type WorldBtnProps = {
  onClick: (id: TimeID, is_spheric: boolean) => void
  time_id: TimeID
}

function WorldBtn({ onClick, time_id }: WorldBtnProps) {
  const [is_spheric, setSpheric] = useState(true)
  return (
    <WorldIcon
      className={`cursor-pointer  w-6 h-6 my-2 
        ${
          is_spheric
            ? "text-emerald-400 child:fill-emerald-400"
            : "text-slate-400 child:fill-slate-400"
        }`}
      onClick={() => {
        onClick(time_id, !is_spheric)
        setSpheric((prev) => !prev)
        //canOrbit(time_id,!is_spheric)
      }}
    />
  )
}

type RotateBtnProps = {}

function RotateBtn(params: RotateBtnProps) {
  return (
    <RotateIcon
      className={`cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type GridBtnProps = {}

function GridBtn(params: GridBtnProps) {
  return <GridIcon className={`cursor-pointer  w-6 h-6 my-2 text-slate-400`} />
}

type PinBtnProps = {}

function PinBtn(params: PinBtnProps) {
  return (
    <PinIcon
      className={`cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}
