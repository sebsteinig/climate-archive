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
import AnchorIcon from "$/assets/icons/anchor.svg"
import LinkIcon from "$/assets/icons/link.svg"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import CameraIcon from "$/assets/icons/camera.svg"
import PinIcon from "$/assets/icons/place.svg"
import InfoIcon from "$/assets/icons/info.svg"
import { Collection } from "@/utils/store/collection/collection.store"
import {
  TimeFrameRef,
  WorldID,
  WorldData,
} from "@/utils/store/worlds/time/time.type"
import Link from "next/link"
import { useStore } from "@/utils/store/store"
import { gsap } from "gsap"
import { usePathname, useRouter } from "next/navigation"
import { resolveURLparams } from "@/utils/URL_params/url_params.utils"
import { SceneRef } from "../Scene"

type Props = {
  className?: string
  displayCollection: (collection: Collection) => void
  data: WorldData
  world_id: WorldID
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
}

export function ContainerConf({
  className,
  displayCollection,
  data,
  current_frame,
  world_id,
  scene_ref,
}: Props) {
  const [is_expanded, expand] = useState(false)

  return (
    <div
      className={` shadow-lg shadow-slate-950 w-fit overflow-y-auto overflow-x-hidden
      z-20 group bg-slate-700 max-h-[90%] grid grid-cols-1 place-items-center
      
      rounded-full p-2   ${className ?? ""}`}
    >
      {is_expanded ? (
        <ArrowDownIcon
          className="shrink-0 grow-0 p-2 w-10 h-10  cursor-pointer text-align:center text-slate-400 child:fill-slate-400"
          onClick={() => expand(false)}
        />
      ) : (
        <ArrowUpIcon
          className="shrink-0 grow-0 p-2 w-10 h-10  cursor-pointer text-align:center text-slate-400 child:fill-slate-400"
          onClick={() => expand(true)}
        />
      )}

      <div className={`${is_expanded ? "visible" : "hidden"}`}>
        <RecenterBtn />
        <FullScreenBtn />
        <AnchorBtn world_id={world_id} current_frame={current_frame} />
        <ScreenshotBtn />
        <WorldBtn
          onClick={(world_id, is_spheric) => {
            const frame = current_frame.current.get(world_id)
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
          world_id={world_id}
        />
        <RotateBtn />
        <GridBtn />
        <PinBtn />
      </div>
      <CamBtn
        onClick={(world_id, linked) => {
          if (scene_ref.current) {
            scene_ref.current.linkCamera(linked)
          }
        }}
        world_id={world_id}
      />
      <DupBtn world_id={world_id} current_frame={current_frame} />
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
      className="shrink-0 grow-0 w-12 h-12  cursor-pointer p-2 text-slate-400"
      onClick={() => {
        onClick(collection)
      }}
    />
  )
}

type DupBtnProps = {
  world_id: WorldID
  current_frame: TimeFrameRef
}

function DupBtn({ world_id, current_frame }: DupBtnProps) {
  const router = useRouter()
  const pathname = usePathname()
  const dup = useStore((state) => state.worlds.dup)

  return (
    <DuplicateIcon
      className="shrink-0 grow-0 w-7 h-7 cursor-pointer my-2 text-slate-400"
      onClick={() => {
        dup(world_id)
      }}
    />
  )
}

type CamBtnProps = {
  onClick: (id: WorldID, linked: boolean) => void
  world_id: WorldID
}

function CamBtn({ onClick, world_id }: CamBtnProps) {
  const [is_linked, link] = useState(true)
  return (
    <CameraIcon
      className={`shrink-0 grow-0 cursor-pointer  w-5 h-5 my-2 ${
        is_linked ? "text-slate-400" : "text-emerald-400"
      }`}
      onClick={() => {
        onClick(world_id, !is_linked)
        link((prev) => !prev)
      }}
    />
  )
}

type RecenterBtnProps = {}

function RecenterBtn(params: RecenterBtnProps) {
  return (
    <RecenterIcon
      className={`shrink-0 grow-0 cursor-pointer w-6 h-6   my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type FullScreenBtnProps = {}

function FullScreenBtn(params: FullScreenBtnProps) {
  return (
    <FullScreenIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type ScreenshotBtnProps = {}

function ScreenshotBtn(params: ScreenshotBtnProps) {
  return (
    <ScreenshotIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400 `}
    />
  )
}

type WorldBtnProps = {
  onClick: (id: WorldID, is_spheric: boolean) => void
  world_id: WorldID
}

function WorldBtn({ onClick, world_id }: WorldBtnProps) {
  const [is_spheric, setSpheric] = useState(true)
  return (
    <WorldIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 
        ${
          is_spheric
            ? "text-emerald-400 child:fill-emerald-400"
            : "text-slate-400 child:fill-slate-400"
        }`}
      onClick={() => {
        onClick(world_id, !is_spheric)
        setSpheric((prev) => !prev)
        //canOrbit(world_id,!is_spheric)
      }}
    />
  )
}

type RotateBtnProps = {}

function RotateBtn(params: RotateBtnProps) {
  return (
    <RotateIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type GridBtnProps = {}

function GridBtn(params: GridBtnProps) {
  return (
    <GridIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 text-slate-400`}
    />
  )
}

type PinBtnProps = {}

function PinBtn(params: PinBtnProps) {
  return (
    <PinIcon
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
    />
  )
}

type AnchorBtnProps = {
  world_id: WorldID
  current_frame: TimeFrameRef
}

function AnchorBtn({ world_id, current_frame }: AnchorBtnProps) {
  const observe = useStore((state) => state.worlds.observe)

  const anchoredWorldId = useStore((state) => state.worlds.observed_world)
  // Check if the current button is anchored
  const is_anchored = anchoredWorldId === world_id

  return (
    <AnchorIcon
      onClick={() => {
        if (!is_anchored) {
          observe(world_id);
          current_frame.current.observe(world_id);
        } else {
          observe(undefined);
          current_frame.current.observe(undefined);
        }
      }}
      className={`shrink-0 grow-0 cursor-pointer  w-6 h-6 my-2 
        ${is_anchored ? "text-emerald-400 " : "text-slate-400 "}`}
    />
  );
}
