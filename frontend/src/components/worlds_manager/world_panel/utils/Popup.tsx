import { useStore } from "@/utils/store/store"
import { Coordinate } from "@/utils/store/graph/graph.type"
import { formatCoordinates } from "@/utils/store/graph/graph.utils"
import { WorldData } from "@/utils/store/worlds/time.type"
import { getTitleOfExp, isPublication } from "@/utils/types.utils"
import { useMemo } from "react"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"


export type PopupInfo = {
  data: WorldData
  world_id : number
  coordinate : Coordinate
}

type PopupProps = PopupInfo & {
  close: () => void
}

export function Popup({ data, coordinate, world_id, close }: PopupProps) {
  let id_label:
    | {
        id: string
        label: string
      }
    | undefined = undefined
  id_label = useMemo(() => {
    if (data.exp) {
      return getTitleOfExp(data.exp)
    }
  }, [data.exp])

  const { f_lat, f_lon } = formatCoordinates(coordinate)
  const add = useStore((state) => state.graph.add)
  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 p-5 flex max-h-1/2 max-w-full overflow-auto 
      flex-wrap rounded-lg items-center gap-5 justify-between
      text-slate-900 bg-slate-200 shadow-md shadow-slate-900"
    >
      <div className="grow max-w-full w-fit flex flex-col">
        <div className="truncate italic">
          {isPublication(data.collection) &&
            `${data.collection.authors_short} (${data.collection.year})`}
        </div>
        <div className=" max-w-full w-fit truncate flex flex-row flex-wrap justify-between">
          <div className="mr-5">
            Location : {f_lat} / {f_lon}
          </div>
          {id_label && (
            <div>
              {id_label.id} | {id_label.label}
            </div>
          )}
        </div>
      </div>
      <ButtonSecondary
        className="small-caps shadow-md shadow-slate-800"
        onClick={() => {
          add({
            lat: coordinate.lat,
            lon: coordinate.lon,
            data: data,
            id_label: id_label,
            world_id : world_id
          })
          close()
        }}
      >
        plot
      </ButtonSecondary>
      <CrossIcon
        className="shrink-0 grow-0 w-10 h-10 mr-5 cursor-pointer text-slate-800 hover:tex-slate-700"
        onClick={() => {
          close()
        }}
      />
    </div>
  )
}
