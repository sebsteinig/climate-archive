import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import BinIcon from "$/assets/icons/bin.svg"
import PinIcon from "$/assets/icons/place.svg"
import ChartIcon from "$/assets/icons/chart.svg"
import DownloadIcon from "$/assets/icons/download.svg"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  defaults,
  Legend,
  Chart,
  ChartData,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Graph } from "@/utils/store/graph/graph.type"
import { isPublication } from "@/utils/types.utils"
import { EVarID } from "@/utils/store/variables/variable.types"
import { titleOf, unitOf } from "./sidebar/variables/utils"
import { getChartData } from "@/utils/api/api"
import { formatCoordinates } from "@/utils/store/graph/graph.utils"
import { SmSeparator } from "./separators/separators"

//defaults.font.family ='Montserrat'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type Props = {
}
export default function Graph({}: Props) {

  const show = useClusterStore(state => state.graph.show)
  const graphs = useClusterStore(state => state.graph.graphs)
  const visible = useClusterStore(state => state.graph.visible)
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
  

  if (graphs.length == 0 || active_variables.length == 0) return null;

  if(!visible) return (
    <div className="absolute right-7 top-7 rounded-full w-fit h-fit bg-slate-700 p-4">
      <ChartIcon
        className="w-9 h-9 cursor-pointer text-slate-400 child:fill-slate-400"
        onClick={() => {show(true)}}
      />
    </div>
  )
  
  return (
    <div className="flex-grow flex flex-row w-[40vw]">
      <div
        className={`p-5 h-full flex-grow w-full rounded-md bg-gray-900`}
      >
        <CrossIcon
          className="w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
          onClick={() => {show(false)}}
        />
        <div className="overflow-y-auto flex flex-col gap-2 overflow-x-hidden max-h-[90%]">

          <div className="w-full p-3">
            <GraphTitles graphs={graphs}/>
          </div>

          {active_variables.map((variable, id : number) => <LineChart key={id}
              variable = {variable} 
              graphs = {graphs}/>)}
        </div>
      </div>
    </div>
  )
}

function GraphTitles({graphs}:{graphs : Graph[]}){
  const remove = useClusterStore(state => state.graph.remove)
  return( 
    <div className="w-full p-2">
      <p className="text-slate-500 tracking-widest text-lg">Locations</p>
      <div className="flex flex-col"></div>
      {graphs.map((graph, id) =>        
        <div key={id} className="flex flex-row items-center gap-2 py-2 justify-between">
          {/* <PinIcon
            className="w-10 h-10 cursor-pointer text-slate-500 child:fill-slate-500 hover:text-slate-600"
          /> */}
          <p className="text-xs tracking-widest" style={{color:graph.color}}>{graphLabel(graph).coordinates}</p>
          <div className="flex flex-row items-center gap-5">
            <p className="text-xs tracking-widest" style={{color:graph.color}}>{graphLabel(graph).id}</p>
            <p className="text-xs  italic" style={{color:graph.color}}> {getGraphTitle(graph)}</p>
          </div>
          <BinIcon 
            className="w-8 h-8 cursor-pointer text-slate-500 hover:text-slate-600"
            onClick={() => remove(id)}
          />
        </div>
      )}
      <div className="w-full px-5 pt-6">
        <SmSeparator className="w-full bg-slate-500"/>
      </div>
    </div>
  )
}

type LineChartProps = {
  graphs : Graph[]
  variable : EVarID
}

enum FormatID {
  png,
  svg,
  csv,
}

type ToDownload = {
  format: FormatID
  href: string
  filename: string
}

function LineChart({graphs, variable}: LineChartProps) {
  const chartRef = useRef<ChartJSOrUndefined<"line", number[], string>>()
  const [download, setDownload] = useState<ToDownload>({
    format: FormatID.png,
    href: chartRef.current ? chartRef.current.toBase64Image() : "",
    filename: `${filename(graphs, titleOf(variable))}.png`,
  })

  
  const [chart_data, setChartData] = useState<number[][]>([])

  useEffect(() => {
    let all_data : number[][] = []
    graphs.map((e) => getChartData(e, variable).then((data) => all_data.push(data)))
    setChartData(all_data)  
  }, [graphs, variable])

  const data = {labels : labels,
      datasets: graphs.map(
      (graph, id) =>{
        return{
          label : `${graphLabel(graph).id} | ${graphLabel(graph).label} (${graphLabel(graph).coordinates})`,
          data : chart_data[id],
          borderColor : `${graph.color}`,
          backgroundColor: `${graph.color}80`,
        }
      })
    }

  const options = {
    //maintainAspectRatio: false ,
    scales: {
      y: {
        title: { display: true, text: `${titleOf(variable)} [ ${unitOf(variable)} ]` },
        // ticks: {
        //   // Include unit in the ticks
        //   callback: function(value : any, index: any, ticks : any) {
        //       return value + ' °C';
        //   }
        // }
      },
      x: {
        title: { display: true, text: "Calendar month" },
      },
    },
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (item: any) => `${item.raw} ${unitOf(variable)}`,
        },
      },
      legend: {
        align: "start" as const,
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Variable ${titleOf(variable)}`,
      },
    },
  }

  if (!data) return null;

  return (
    <div className="p-3 w-full">
      <div className="bg-slate-200 w-full rounded-md">
        <Line ref={chartRef} options={options} data={data} />
      </div>
      <div className="flex flex-row justify-between items-center p-2">
        <h5>source : {getTitleMultipleSources(graphs)}
        </h5>

        <div className="flex flex-row items-center gap-2">
          <ButtonFormat
            active={download.format == FormatID.png}
            name="PNG"
            onClick={() => {
              setDownload({
                format: FormatID.png,
                href: chartRef.current
                  ? chartRef.current.toBase64Image()
                  : download.href,
                filename: chartRef.current
                  ? `${filename(graphs, titleOf(variable))}.png`
                  : download.filename,
              })
            }}
          />
          <ButtonFormat
            active={download.format == FormatID.svg}
            name="SVG"
            onClick={() => {
              console.log("TODO")
              setDownload({
                format: FormatID.svg,
                href: "",
                filename: `${filename(graphs, titleOf(variable))}.svg`,
              })
            }}
          />
          <ButtonFormat
            active={download.format == FormatID.csv}
            name="CSV"
            onClick={() => {
              const blob = new Blob([toCSV(data)], { type: "text/csv" })
              setDownload({
                format: FormatID.csv,
                href: URL.createObjectURL(blob),
                filename: `${filename(graphs, titleOf(variable))}.csv`,
              })
            }}
          />

          {chartRef.current && (
            <a href={download.href} download={download.filename}>
              <div
                className="border-2 w-fit h-fit p-1 border-slate-500
                hover:border-slate-600 rounded-md"
              >
                <DownloadIcon
                  className="w-7 h-7 cursor-pointer
                text-slate-500 child:fill-slate-500 hover:text-slate-600"
                />
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ButtonFormat(props: {
  name: string
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`w-fit text-stone-950 tracking-widest capitalize
      rounded-md h-fit py-1.5 px-2 
      ${
        props.active
          ? "bg-sky-300"
          : "bg-slate-300 cursor-pointer hover:bg-sky-600"
      }`}
      onClick={() => {
        props.onClick()
      }}
    >
      {props.name}
    </div>
  )
}

function toCSV(
  data : ChartData<"line", number[], string>
) {
  if (!data.labels) return "";
  let csvRows = []
  csvRows.push("labels," + data.labels.join(","))
  for (const dataset of data.datasets) {
    csvRows.push(dataset.label + "," + dataset.data.join(","))
  }

  // Returning the array joining with new line
  return csvRows.join("\n")
}


function getGraphTitle(graph : Graph ){
    return (
      isPublication(graph.data.collection)?
      `${graph.data.collection.authors_short} (${graph.data.collection.year})`
      :`${graph.data.exp?.id}`
    )
}

function filename(graphs : Graph[], var_name : string){
  let ids = ""
  for (let graph of graphs){
    ids += `${graph.id_label? graph.id_label.id : "exp"}.`
  }
  return `climatearchive.${var_name}.${ids}${getGraphTitle(graphs[0])}`
}

function graphLabel(graph : Graph){
  const id = graph.id_label ? `${graph.id_label.id}` : ""
  const label =  graph.id_label ?`${graph.id_label.label}`:""
  const {f_lon, f_lat} = formatCoordinates({lon:graph.lon, lat:graph.lat})
  return {id : id, label: label, coordinates :`${f_lon} / ${f_lat}`}
}

function getTitleMultipleSources(graphs : Graph[]){
  let titles : string[] = []
  for (let graph of graphs){
    if(isPublication(graph.data.collection)){
      if(!titles.includes(getGraphTitle(graph))){
        titles.push(getGraphTitle(graph))
      }
    }
  }
  return titles.join(" & ")
}