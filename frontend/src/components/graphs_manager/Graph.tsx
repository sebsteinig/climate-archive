import { Line } from "react-chartjs-2"
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
} from "chart.js"
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types"

import React, { useEffect, useRef, useState } from "react"
import { Graph } from "@/utils/store/graph/graph.type"
import { EVarID } from "@/utils/store/variables/variable.types"
import {
  filename,
  getTitleMultipleSources,
  graphLabel,
} from "./utils/graph.legends"
import { DownloadButtons, toCSV } from "./utils/graph.download"
import { getChartData } from "@/utils/api/api"
import { titleOf, unitOf } from "../sidebar/variables/variable.utils"

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

type LineChartProps = {
  lines: Graph[]
  variable: EVarID
}

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

export default function Graph({ lines, variable }: LineChartProps) {
  const chartRef = useRef<ChartJSOrUndefined<"line", number[], string>>()
  const [chart_data, setChartData] = useState<number[][]>([])

  useEffect(() => {
    let all_data: number[][] = []
    lines.map((e) =>
      getChartData(e, variable).then((data) => all_data.push(data)),
    )
    setChartData(all_data)
  }, [lines, variable])

  const data = {
    labels: labels,
    datasets: lines.map((graph, id) => {
      return {
        label: `${graphLabel(graph).id} | ${graphLabel(graph).label} (${
          graphLabel(graph).coordinates
        })`,
        data: chart_data[id],
        borderColor: `${graph.color}`,
        backgroundColor: `${graph.color}80`,
      }
    }),
  }

  const options = {
    //maintainAspectRatio: false ,
    scales: {
      y: {
        title: {
          display: true,
          text: `${titleOf(variable)} [ ${unitOf(variable)} ]`,
        },
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

  if (!data) return null

  return (
    <div className="p-3 w-full">
      <div className="bg-slate-200 w-full rounded-md">
        <Line ref={chartRef} options={options} data={data} />
      </div>
      <div className="flex flex-row justify-between items-center p-2">
        <h5>source : {getTitleMultipleSources(lines)}</h5>
        {chartRef.current && data != undefined && (
          <DownloadButtons
            csv_href={toCSV(data)}
            filename={filename(lines, titleOf(variable))}
            png_href={chartRef.current ? chartRef.current.toBase64Image() : ""}
          />
        )}
      </div>
    </div>
  )
}
