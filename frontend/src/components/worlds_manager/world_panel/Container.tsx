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
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { formatCoordinates } from "@/utils/store/graph/graph.utils"

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
  showClickPanel : (data:WorldData,coordinate : Coordinate) => void
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
        showClickPanel(data, {lat,lon}) {
            setPopupData({data,coordinate:{lat,lon}})
        },
      }
    })

    const frame = current_frame.current.get(time_id)
    const [popup_data,setPopupData] = useState<{data:WorldData,coordinate:Coordinate}|undefined>(undefined)
    return (
      <div
        className={`relative overflow-hidden w-full h-full ${className ?? ""}`}
        ref={div_ref}
      >
        {children}

        {data.collection && isPublication(data.collection) && (
          <p className="absolute bottom-0 left-0 select-none italic m-4 text-slate-400 text-sm">
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
        {
          popup_data && (
            <div className="absolute z-20 bottom-0 m-5 left-1/2 -translate-x-1/2">
              <Popup
                close={() => {
                  setPopupData(undefined)
                }} 
                data={popup_data.data}
                coordinate={popup_data.coordinate}
                />
            </div>
          )
        }

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

type PopupProps = {
  data : WorldData
  coordinate : Coordinate
  close : () => void
}

function Popup({data,coordinate,close}:PopupProps) {
  let id_label :{
    id: string;
    label: string;
  } | undefined = undefined
  id_label = useMemo(() =>{
    if(data.exp) {
      return getTitleOfExp(data.exp)
    }
  }, [data.exp])
  
  const {f_lat,f_lon} = formatCoordinates(coordinate)
  const add = useClusterStore(state => state.graph.add)
  return (
    <div className="p-5 flex flex-row rounded-lg items-center text-slate-900 bg-slate-200 shadow-md shadow-slate-900">
      <CrossIcon
        className="grow-0 w-10 h-10 mr-5 cursor-pointer text-slate-800 hover:tex-slate-700"
        onClick={() => {
          close()
        }}
      />
      <div className="grow flex flex-col pr-5">
        <div className="italic">
          {isPublication(data.collection) && `${data.collection.authors_short} (${data.collection.year})`}
        </div>
        <div className="flex flex-row justify-between">
          <div className="mr-5">Location : {f_lat} / {f_lon}</div>
          {id_label && <div>{id_label.id} | {id_label.label}</div>}
        </div>
      </div>
      <ButtonSecondary 
        className="small-caps shadow-md shadow-slate-800" 
        onClick={() => {
          add({lat : coordinate.lat, lon:coordinate.lon, data : data, id_label : id_label})
          close()
        }}
      >plot
      </ButtonSecondary>
    </div>
  )
}

