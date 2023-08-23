import { useStore } from "@/utils/store/store"
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
  WorldID,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time.type"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import Select from "@/components/inputs/Select"
import { Collection } from "@/utils/store/collection.store"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { ContainerConf } from "./utils/ContainerConf"
import { SceneRef } from "./Scene"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { formatCoordinates } from "@/utils/store/graph/graph.utils"
import { ControllerRef, TimeController } from "../time_controllers/utils/TimeController"
import { IControllerRef } from "../time_controllers/controller.types"
import { Popup } from "./utils/Popup"
import { Selector } from "./utils/Selector"

type Props = {
  className?: string
  world_id: WorldID
  grid_id: number
  data: WorldData
  displayCollection: (collection: Collection) => void
  current_frame: TimeFrameRef
  scene_ref: RefObject<SceneRef>
}

export type ContainerRef = {
  track: MutableRefObject<HTMLDivElement>
  showClickPanel : (data:WorldData,coordinate : Coordinate) => void
  controller : ControllerRef,
}

export const Container = forwardRef<ContainerRef, Props>(
  function Container(
    {
      world_id,
      data,
      className,
      grid_id,
      current_frame,
      displayCollection,
      scene_ref,
    },
    ref,
  ) {
    const remove = useStore((state) => state.worlds.remove)
    
    const div_ref = useRef<HTMLDivElement>(null!)
    const controller_ref = useRef<ControllerRef>(null)

    useImperativeHandle(ref, () => {
      return {
        track: div_ref,
        showClickPanel(data, {lat,lon}) {
            setPopupData({data,coordinate:{lat,lon}})
        },
        controller : controller_ref.current!
      }
    })
    const [popup_data,setPopupData] = useState<{data:WorldData,coordinate:Coordinate}|undefined>(undefined)
    return (
      <div
        className={`relative select-none p-5 flex flex-col justify-between
        overflow-hidden w-full h-full ${className ?? ""}`}
        ref={div_ref}
      >
        <div className="max-w-1/2 w-fit
          flex flex-row">
          <CrossIcon
              className="grow-0 shrink-0 w-10 h-10 cursor-pointer text-slate-400 hover:tex-slate-300"
              onClick={() => {
                current_frame.current.map.delete(world_id)
                remove(world_id)
              }}
            />
          <Selector data={data} world_id={world_id}/>
        </div>

          <div className="pointer-events-none max-h-full justify-end mr-20 flex flex-col gap-5">
            {
              popup_data ? (
                <div className="max-w-full w-fit grow self-center pointer-events-auto">
                  <Popup
                    close={() => {
                      setPopupData(undefined)
                    }} 
                    data={popup_data.data}
                    coordinate={popup_data.coordinate}
                    />
                </div>
              ):null
            }
            <TimeController
              className="grow-0 shrink-0"
              current_frame={current_frame}
              world_id={world_id}
              data={data}
              ref={controller_ref}
            />
            {data.collection && isPublication(data.collection) && (
              <p className="select-none italic text-slate-400 text-sm">
                {data.collection.authors_short}, {data.collection.year}
              </p>
            )}
        </div>
        <ContainerConf
            className="absolute right-0 bottom-0 m-5"
            data={data}
            current_frame={current_frame}
            displayCollection={displayCollection}
            world_id={world_id}
            scene_ref={scene_ref}
          />
      </div>
    )
  },
)




