import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import React, {useMemo} from "react"
import { useStore } from "@/utils/store/store"
import { getTitleOfExp } from "@/utils/types.utils"
import { getRandomHexColor } from "@/utils/store/graph/graph.utils"
import Graph from "./Graph"
import GraphButton from "./utils/GraphButton"
import { GraphTitles } from "./utils/graph.legends"

/**
 * manages all the locations and different graphs displayed
 * @returns component containing all the graphs and locations info
 */
export default function GraphsManager() {
  const show = useStore((state) => state.graph.show)
  const graphs = useStore((state) => state.graph.graphs)
  const worlds = useStore((state) => state.worlds.slots)
  const visible = useStore((state) => state.graph.visible)
  const stored_active_variables = useStore((state) => state.active_variables)
  const active_variables = useMemo(() => {
    let actives = []
    for (let [key, active] of stored_active_variables.entries()) {
      if (active) actives.push(key)
    }
    return actives
  }, [stored_active_variables])


  /* graphs contains all the locations so we want as many lines as different worlds */
  /* lines contains the info for each line (one position and one experiment) */
  const lines = useMemo(() => {
    let res = []
    for(let g of graphs){
      for (let w of worlds){
        if (!(w[1].exp)) continue;
        const same = res.filter((l) => l.data.exp?.id == w[1].exp?.id && l.lat == g.lat && l.lon == g.lon )
        if (same.length != 0) continue;
        res.push({
          data : w[1],
          world_id : w[0],
          color : getRandomHexColor(),
          id_label : getTitleOfExp(w[1].exp),
          lat : g.lat,
          lon : g.lon
        })
      }
    }
    return res
  }, [graphs, worlds])

  if (graphs.length == 0 || active_variables.length == 0) return null

  if (!visible) return <GraphButton/>

  return (
    <div className="flex-grow flex flex-row w-[50vw]">
      <div className={`p-5 h-full flex-grow w-full rounded-md bg-gray-900`}>
        <CrossIcon
          className="w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
          onClick={() => {
            show(false)
          }}
        />
        <div className="overflow-y-auto flex flex-col gap-2 overflow-x-hidden max-h-[90%]">
          <div className="w-full p-3">
            <GraphTitles lines={lines} graphs = {graphs}/>
          </div>

          {active_variables.map((variable, id: number) => (
            <Graph key={id} variable={variable} lines={lines} />
          ))}
        </div>
      </div>
    </div>
  )
}