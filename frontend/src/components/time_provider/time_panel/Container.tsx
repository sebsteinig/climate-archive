import { useClusterStore } from "@/utils/store/cluster.store"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import {
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  TimeFrameRef,
  TimeID,
  TimeMode,
  WorldData,
} from "@/utils/store/time/time.type"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import Select from "@/components/inputs/Select"
import { Collection } from "@/utils/store/collection.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { ContainerConf } from "./ContainerConf"
import { SceneRef } from "./Scene"

type Props = {
  className?: string
  time_id: TimeID
  grid_id: number
  data: WorldData
  displayCollection: (collection: Collection) => void
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
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
      scene_ref,
      children,
    },
    ref,
  ) {
    const remove = useClusterStore((state) => state.time.remove)
    const changeExp = useClusterStore((state) => state.time.changeExp)
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

    const frame = current_frame.current.get(time_id)

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
        <div className="absolute top-0 left-0 flex m-2">
          <CrossIcon
            className="w-10 h-10 cursor-pointer text-slate-400 hover:tex-slate-300"
            onClick={() => {
              current_frame.current.map.delete(time_id)
              remove(time_id)
            }}
          />
          {data.time.mode === TimeMode.ts && (
            <Select
              className="ml-5"
              defaultValue={data.exp?.id}
              onChange={(e) => {
                const idx = e.target.selectedIndex
                const exp = data.collection.exps[idx]

                database_provider.load({ exp_id: exp.id }).then(async () => {
                  changeExp(time_id, exp)
                })
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
          )}
        </div>

        <ContainerConf
          className="absolute bottom-0 right-0 m-2 "
          data={data}
          current_frame={current_frame}
          displayCollection={displayCollection}
          time_id={time_id}
          scene_ref={scene_ref}
        />
      </div>
    )
  },
)
