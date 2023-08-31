import { Graph } from "@/utils/store/graph/graph.type"
import { useStore } from "@/utils/store/store"
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import { SmSeparator } from "../../separators/separators"
import { isPublication } from "@/utils/types.utils"
import { formatCoordinates } from "@/utils/store/graph/graph.utils"

export function GraphTitles({
  graphs,
  lines,
}: {
  graphs: Graph[]
  lines: Graph[]
}) {
  const remove = useStore((state) => state.graph.remove)
  return (
    <div className="w-full p-2 m-5">
      <p className="text-slate-500 tracking-widest text-lg">Locations</p>
      {graphs.map((graph, id) => (
        <div key={id} className="flex flex-row gap-20 py-2 items-start">
          <div className="flex flex-row gap-4 items-center">
            <CrossIcon
              className="shrink-0 grow-0 w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
              onClick={() => {
                remove(id)
              }}
            />
            <p className="tracking-widest">{graphLabel(graph).coordinates}</p>
          </div>
          <ExperimentTitles
            lines={lines.filter(
              (line) => line.lat == graph.lat && line.lon == graph.lon,
            )}
          />
        </div>
      ))}
      <div className="w-full px-5 pt-6">
        <SmSeparator className="w-full bg-slate-500" />
      </div>
    </div>
  )
}

export function ExperimentTitles({ lines }: { lines: Graph[] }) {
  const exp_map = new Map()
  lines.map((l) => {
    const line_info = exp_map.get(getGraphTitle(l))
    if (line_info) {
      exp_map.set(getGraphTitle(l), [
        ...line_info,
        { exp_id: graphLabel(l).id, color: l.color },
      ])
    } else {
      exp_map.set(getGraphTitle(l), [
        { exp_id: graphLabel(l).id, color: l.color },
      ])
    }
  })

  return (
    <div className="flex flex-col">
      {Array.from(exp_map.entries()).map((element, id) => (
        <div key={id} className="flex flex-row items-center gap-5">
          <p className="italic"> {element[0]}</p>
          <p>
            {element[1].map(
              (exp: { exp_id: string; color: string }, i: number) => (
                <span
                  className="tracking-widest"
                  key={i}
                  style={{ color: exp.color }}
                >
                  {exp.exp_id}
                  {i < element[1].length - 1 && ", "}
                </span>
              ),
            )}
          </p>
        </div>
      ))}
    </div>
  )
}

export function getGraphTitle(graph: Graph) {
  return isPublication(graph.data.collection)
    ? `${graph.data.collection.authors_short} (${graph.data.collection.year})`
    : `${graph.data.exp?.id}`
}

export function filename(graphs: Graph[], var_name: string) {
  let ids = ""
  for (let graph of graphs) {
    ids += `${graph.id_label ? graph.id_label.id : "exp"}.`
  }
  return `climatearchive.${var_name}.${ids}${getGraphTitle(
    graphs[0],
  )}`.replaceAll(" ", "_")
}

export function graphLabel(graph: Graph) {
  const id = graph.id_label ? `${graph.id_label.id}` : ""
  const label = graph.id_label ? `${graph.id_label.label}` : ""
  const { f_lon, f_lat } = formatCoordinates({ lon: graph.lon, lat: graph.lat })
  return { id: id, label: label, coordinates: `${f_lon} / ${f_lat}` }
}

export function getTitleMultipleSources(graphs: Graph[]) {
  let titles: string[] = []
  for (let graph of graphs) {
    if (!titles.includes(getGraphTitle(graph))) {
      titles.push(getGraphTitle(graph))
    }
  }
  return titles.join(" & ")
}
