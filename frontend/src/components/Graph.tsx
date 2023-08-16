import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
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
} from "chart.js"
import { Line } from "react-chartjs-2"
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types"
import { useClusterStore } from "@/utils/store/cluster.store"
import { Graph } from "@/utils/store/graph/graph.type"
import { isPublication } from "@/utils/types.utils"
import { EVarID } from "@/utils/store/variables/variable.types"
import { titleOf, unitOf } from "./sidebar/variables/utils"
import { getChartData } from "@/utils/api/api"

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

  

  if(!visible) return null;
  return (
    <div className="flex-grow flex flex-row">
      <div
        className={`p-5 h-full flex-grow w-full rounded-md bg-gray-900`}
      >
        <CrossIcon
          className="w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
          onClick={() => show(false)}
        />
        <div className="overflow-y-auto flex flex-col gap-2 overflow-x-hidden max-h-[90%]">
          {active_variables.map((variable, id) => <LineChart key={id} variable = {variable} graphs = {graphs}/>)}
        </div>
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
    filename: "file.png",
  })
  console.log(graphs[0].data.exp?.id);
  
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
        text: `Variable ${titleOf(variable)} for experiments ...`,
      },
    },
  }

  const d1 = labels.map((_n: string, i: number) => Math.random() * 2)
  const d2 = labels.map((_n: string, i: number) =>
    Math.floor(Math.random() * 34),
  )

  const data = {
    labels,
    datasets: graphs.map((graph, id) =>{
      return{
        label : "",
        data : getChartData(graph),
        borderColor : `rgb(255, ${(99 + id )%255}, 132)`,
        backgroundColor: `rgba(255, ${(99 + id)%255}, 132, 0.5)`,
      }
    })
  }

  // datasets: [
  //   {
  //     label: "Present day",
  //     data: d1,
  //     borderColor: "rgb(255, 99, 132)",
  //     backgroundColor: "rgba(255, 99, 132, 0.5)",
  //   },
  //   {
  //     label: "Dataset 2",
  //     data: d2,
  //     borderColor: "rgb(53, 162, 235)",
  //     backgroundColor: "rgba(53, 162, 235, 0.5)",
  //   },
  // ],

  return (
    <div className="p-3">
      <div className="bg-slate-200  w-[40vw]">
        <Line ref={chartRef} options={options} data={data} />
      </div>
      <div className="flex flex-row justify-between items-center p-2">
        <h5>source : {getGraphTitle(graphs)}
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
                  ? "png_filename.png"
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
                filename: "filename_svg",
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
                filename: "filename_csv.csv",
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

function toCSV(data: {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}) {
  let csvRows = []
  csvRows.push("labels," + data.labels.join(","))
  for (const dataset of data.datasets) {
    csvRows.push(dataset.label + "," + dataset.data.join(","))
  }

  // Returning the array joining with new line
  return csvRows.join("\n")
}


function getGraphTitle(graphs : Graph[] ){
  return (
    isPublication(graphs[0].data.collection)?
    `${graphs[0].data.collection.authors_short} (${graphs[0].data.collection.year})`
    :`${graphs[0].data.exp?.id}`
  )
}