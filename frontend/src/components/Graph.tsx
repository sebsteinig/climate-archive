
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import DownloadIcon from "$/assets/icons/download.svg"
import React, { useEffect, useRef, useState } from 'react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";


//defaults.font.family ='Montserrat'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
          'August', 'September', 'October', 'November', 'December'];
  

type Props = {
    onClose : { fn: () => void }
    //data
}
export default function Graph(props : Props){
  

  return(
      <div className="flex-grow flex flex-row my-5">
        <div className={`p-5 h-full flex-grow w-full mx-5 rounded-md bg-gray-900`}>
          <CrossIcon
              className="w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
              onClick={() => props.onClose.fn()}
          />
          <div className="overflow-y-auto flex flex-col gap-2 overflow-x-hidden max-h-[90%]">              
            {<LineChart/>}
          </div>
        </div>
      </div>        
  )
}


type LineChartProps = { }

enum FormatID {
  png,
  svg,
  csv
}


type ToDownload = {
  format : FormatID,
  href : string,
  filename : string
}
function LineChart(props : LineChartProps){
  const chartRef = useRef<ChartJSOrUndefined<"line", number[], string>>();
  const [download, setDownload] = useState<ToDownload>({
    format : FormatID.png,
    href : chartRef.current? chartRef.current.toBase64Image() : "",
    filename : "file.png"
  })
  
  const options = {
    scales: {
      y:{
        title:{ display : true, text : "Temperature [ °C ]"},
        // ticks: {
        //   // Include unit in the ticks
        //   callback: function(value : any, index: any, ticks : any) {
        //       return value + ' °C';
        //   }
        // } 
      },
      x:{
        title:{ display : true, text : "Calendar month"},
      }
    },
    responsive: true,
    plugins: {
      tooltip:{
        enabled : true,
        callbacks: {
            label: (item : any) => `${item.raw} °C`
          },
      },
      legend: {
        align : 'start' as const,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Variable Precipitation for experiments ...',
      },
    },
  };

  const d1 = labels.map((_n : string, i : number) => (Math.random() * 2))
  const d2 = labels.map((_n : string, i : number) => Math.floor(Math.random() * 34))

  
  const data = {
      labels,
      datasets: [
        {
          label: 'Present day',
          data: d1,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Dataset 2',
          data: d2,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
    

  
  return(
    <div className="p-3">
      <div className="bg-slate-200">
          <Line ref={chartRef} options={options} data={data} />
      </div>
      <div className="flex flex-row justify-between items-center p-2">
        <h5>source : Valdes et al (2021)</h5>

          <div className="flex flex-row items-center gap-2">          
            <ButtonFormat active={download.format == FormatID.png} 
                  name = "PNG"
                  onClick={() => {
                    setDownload({
                      format:FormatID.png,
                      href : chartRef.current?chartRef.current.toBase64Image() : download.href,
                      filename : chartRef.current?"png_filename.png":download.filename
                    })
                  }}      
            />
            <ButtonFormat active={download.format == FormatID.svg} 
                  name = "SVG"
                  onClick={() => {
                    console.log("TODO");                    
                    setDownload({
                      format:FormatID.svg,
                      href : "",
                      filename : "filename_svg"
                    })
                  }}  
              />
            <ButtonFormat active={download.format == FormatID.csv} 
                  name = "CSV"
                  onClick={() => {
                    const blob = new Blob([toCSV(data)], { type: 'text/csv' });
                    setDownload({
                      format : FormatID.csv,
                      href : URL.createObjectURL(blob),
                      filename : "filename_csv.csv"
                    })
                  }}
            />

            {chartRef.current && 
              <a href={download.href} 
                  download={download.filename} 
              >
              <div className="border-2 w-fit h-fit p-1 border-slate-500
                hover:border-slate-600 rounded-md">
              <DownloadIcon className="w-7 h-7 cursor-pointer
                text-slate-500 child:fill-slate-500 hover:text-slate-600"/>
              </div>
            </a>}
          </div>

      </div>
    </div>
  )
}

function ButtonFormat(props : {name : string, active : boolean, onClick : () => void}){
  return(
    <div className={`w-fit text-stone-950 tracking-widest capitalize
      rounded-md h-fit py-1.5 px-2 
      ${props.active?"bg-sky-300":"bg-slate-300 cursor-pointer hover:bg-sky-600"}`}
      onClick={()=>{ props.onClick()}}
    >
      {props.name}
    </div>
  )
}

function toCSV(data : {
    labels : string[], 
    datasets: {
      label: string,
      data: number[],
      borderColor: string,
      backgroundColor: string
    }[]
  }){
    let csvRows = [];
    csvRows.push("labels," + data.labels.join(","))
    for (const dataset of data.datasets){
      csvRows.push(dataset.label + "," + dataset.data.join(","))
    }

    // Returning the array joining with new line 
    return csvRows.join('\n')
}