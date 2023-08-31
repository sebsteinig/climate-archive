import { ChartData } from "chart.js"
import { useState } from "react"
import DownloadIcon from "$/assets/icons/download.svg"


function ButtonFormat(props: {
    download: ToDownload
    format: FormatID
    onClick: (value : ToDownload) => void
    csv_href :string
    filename : string
    png_href : string
  }) {
    const name = FormatID[props.format]
    let href = ""
    switch (props.format){
        case (FormatID.csv):
            href = props.csv_href
            break
        case (FormatID.png):
            href = props.png_href
            break
        case (FormatID.csv):
            href=""
            console.log("TODO");
            break            
    }

    const value = {
        format : props.format,
        href: href,
        filename: `${props.filename}.${name}`
    }
    
    return (
      <div
        className={`w-fit text-stone-950 tracking-widest capitalize
        rounded-md h-fit py-1.5 px-2 
        ${props.download.format === props.format
            ? "bg-sky-300"
            : "bg-slate-300 cursor-pointer hover:bg-sky-600"
        }`}
        onClick={() => {
          props.onClick(value)
        }}
      >
        <span className="uppercase">{name}</span>
      </div>
    )
}
  

export function toCSV(data: ChartData<"line", number[], string>) {
    if (!data.labels) return ""
    let csvRows = []
    csvRows.push("labels," + data.labels.join(","))
    for (const dataset of data.datasets) {
      csvRows.push(dataset.label + "," + dataset.data.join(","))
    }  
    // array joining with new line
    const csv_data = csvRows.join("\n")
    const blob = new Blob([csv_data], { type: "text/csv" })
    return URL.createObjectURL(blob)
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

type DownloadButtonsProps = {
    png_href : string,
    filename : string,
    csv_href : string

}

export function DownloadButtons({png_href, csv_href, filename } : DownloadButtonsProps){
  const [download, setDownload] = useState<ToDownload>({
      format: FormatID.png,
      href: png_href,
      filename: `${filename}.png`,
    })
  return(
    <div className="flex flex-row items-center gap-2">
      {[FormatID.png, FormatID.svg, FormatID.csv].map((k, i) => 
        <ButtonFormat
            key ={i}
            format={k}
            download={download}
            png_href={png_href}
            csv_href = {csv_href}
            filename = {filename}
            onClick={(value : ToDownload) => setDownload(value)}
        />
      )}

      {download.href!=="" && (
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
  )
}