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
import {
  MutableRefObject,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { TimeFrameRef, TimeID, WorldData } from "@/utils/store/time/time.type"
import InfoIcon from "$/assets/icons/info.svg"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import Select from "@/components/inputs/Select"
import { Collection } from "@/utils/store/collection.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
  className?: string
  time_id: TimeID
  grid_id: number
  data: WorldData
  displayCollection: (collection: Collection) => void
  current_frame: TimeFrameRef
}

export type ContainerRef = {
  track: MutableRefObject<HTMLDivElement>
}

export const Container = forwardRef<ContainerRef, PropsWithChildren<Props>>(
  function Container(
    {
      time_id,
      data,
      className,
      grid_id,
      current_frame,
      displayCollection,
      children,
    },
    ref,
  ) {
    const dup = useClusterStore((state) => state.time.dup)
    const remove = useClusterStore((state) => state.time.remove)
    const stored_active_variables = useClusterStore(
      (state) => state.active_variables,
    )
    const active_variables = useMemo(() => {
      let actives = []
      for (let [key, active] of stored_active_variables.entries()) {
        if (active) actives.push(key)
      }
      return actives
    }, [stored_active_variables])

    const div_ref = useRef<HTMLDivElement>(null!)

    useImperativeHandle(ref, () => {
      return {
        track: div_ref,
      }
    })

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [display_buttons, displayButtons] = useState(false)

    const onChangeExp: (id: string) => void = (id: string) => {
      let p = new URLSearchParams()
      if(!pathname.includes("publication")){
        p.append(isPublication(data.collection) ? 
          `${data.collection.authors_short.replaceAll(" ", ".")}*${
            data.collection.year
          }`: `${data.collection.exps.map((e) => e.id + ".")}`, id)
        router.push(`/publication?reload=false&${p.toString()}`)
      } else {
        Array.from(searchParams, ([k, v], i) => {
          p.append(k, i == grid_id + 1 ? id : v)
        })
        router.push(`${pathname}?${p.toString()}`)
      }
    }

    const [route_on_dup, params_on_del, current_exp_id] = useMemo(() => {
      const key = isPublication(data.collection)
      ? `${data.collection.authors_short.replaceAll(" ", ".")}*${data.collection.year}`
      : `${data.collection.exps.map((e) => e.id + ".")}`   

      let on_dup = new URLSearchParams()
      let on_del = new URLSearchParams()
      if (grid_id + 1 >= Array.from(searchParams).length){        
        on_dup.append(key, data.collection.exps[0].id)
        on_dup.append(key, data.collection.exps[0].id)
        return [`/publication?reload=false&${on_dup.toString()}`, on_del, data.collection.exps[0].id];
      }
     //on duplicate
      on_dup.set( key, Array.from(searchParams)[grid_id + 1][1])      
      const route_dup = `${pathname}?${searchParams.toString()}&${on_dup.toString()}`
        
        
      //on delete
      Array.from(searchParams, ([k, v], idx) => {
        if (idx != grid_id + 1) {
          on_del.append(k, v)
        }
      })

      //on change experiment
      const exp_id = Array.from(searchParams)[grid_id + 1][1]
      if (exp_id == data.collection.exps[0].id)
        return [route_dup, on_del.toString(), exp_id]
      const current_exp = data.collection.exps.filter((e) => e.id == exp_id)
      if (current_exp.length == 0)
        return [
          route_dup,
          on_del.toString(),
          data.collection.exps[0].id,
        ]
      database_provider
        .load({
          exp_id: exp_id,
        })
        .then(() => {
          const frame = current_frame.current.get(time_id)
          if (!frame) return
          current_frame.current
            .init(time_id, current_exp[0], active_variables)
            .then(() => {})
        })
      return [route_dup, on_del.toString(), exp_id]
    }, [Array.from(searchParams)])

    return (
      <div
        className={`relative overflow-hidden w-full h-full ${className ?? ""}`}
        ref={div_ref}
      >
        {children}

        {data.collection && isPublication(data.collection) && (
          <p className="absolute bottom-0 left-0 italic m-4 text-slate-400 text-sm">
            {data.collection.authors_short}, {data.collection.year}
          </p>
        )}
        {(!pathname.includes("publication") || grid_id + 1 < Array.from(searchParams).length) && (
          <div className="absolute top-0 left-0 flex m-2">
            <Link href={`${pathname}?${params_on_del}`}>
              <CrossIcon
                className="w-10 h-10 cursor-pointer text-slate-400 hover:tex-slate-300"
                onClick={() => remove(time_id)}
              />
            </Link>

            <Select
              className="ml-5"
              defaultValue={current_exp_id}
              onChange={(e) => {
                const idx = e.target.selectedIndex
                const exp = data.collection.exps[idx]
                onChangeExp(exp.id)
              }}
            >
              {data.collection?.exps.map((e) => {
                const { id, label } = getTitleOfExp(e)
                return (
                  <option key={e.id} value={e.id}>
                    {id} | {label}
                  </option>
                )
              })}
            </Select>
          </div>
        )}

        <div
          className={` shadow-lg shadow-slate-950 
          absolute z-30 group bottom-0 right-0 bg-gray-900
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
              className="p-2 hidden w-10 h-10 cursor-pointer text-align:center group-hover:block text-slate-400 child:fill-slate-400"
              onClick={() => displayButtons(true)}
            />
          )}

          <InfoIcon
            className="w-12 h-12 cursor-pointer p-2 text-slate-400"
            onClick={() => displayCollection(data.collection)}
          />

          {(!pathname.includes("publication") || grid_id + 1 < Array.from(searchParams).length) && (
            <Link href={route_on_dup} >
              <DuplicateIcon
                className="w-10 h-10 cursor-pointer p-2 text-slate-400"
                onClick={() => {
                  dup(time_id)
                }}
              />
            </Link>
          )}
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

function PanelConfiguration({ time_id, data, displayButtons }: ConfProps) {
  const [as_planet, setAsPlanet] = useState(true)
  const linkCamera = useClusterStore((state) => state.time.linkCamera)
  return (
    <div className="grid grid-cols-1 gap-1 justify-items-center ">
      <ArrowDownIcon
        className="p-2 w-10 h-10 cursor-pointer text-slate-400 child:fill-slate-400"
        onClick={() => displayButtons(false)}
      />

      {/* <div className="grid grid-cols-2 items-center p-2">
        <LinkIcon className="cursor-pointer w-4 h-4"
          onClick={() => null}
          /> */}
      {/* </div> */}

      <CameraIcon
        className={`cursor-pointer w-5 h-5 my-2 ${
          data.conf.camera.is_linked ? "text-slate-400" : "text-slate-300"
        }`}
        onClick={() => {
          linkCamera(time_id, !data.conf.camera.is_linked)
        }}
      />

      <RecenterIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
      />

      <FullScreenIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
      />

      <ScreenshotIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-400 child:fill-slate-400 `}
      />

      <WorldIcon
        className={`cursor-pointer w-6 h-6 my-2 
        ${
          as_planet
            ? "text-emerald-400 child:fill-emerald-400"
            : "text-slate-400 child:fill-slate-400"
        }`}
        onClick={() => setAsPlanet((prev) => !prev)}
      />

      <RotateIcon
        className={`w-7 h-7 my-2 text-slate-400 child:fill-slate-400
        ${as_planet ? "cursor-pointer" : "opacity-70"}`}
      />

      <GridIcon className={`cursor-pointer w-6 h-6 my-2 text-slate-400`} />

      <PinIcon
        className={`cursor-pointer w-6 h-6 my-2 text-slate-400 child:fill-slate-400`}
      />
    </div>
  )
}
