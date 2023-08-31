import { Label, Row } from "@/components/searchbar/filters/filter.utils"
import { useState } from "react"

type ColorMapRowProps = {
  colormap_name: string
  onChange: (number: string) => void
}

export function ColorMapRow({ colormap_name, onChange }: ColorMapRowProps) {
  const [display_color_maps, displayColorMaps] = useState<boolean>(false)
  const colormaps_test = [
    "cbrewerSpeed3.png",
    "cmapHaxby.png",
    "ipccPrecip.png",
    "cmoceanThermal.png",
  ]
  return (
    <Row>
      <Label
        onClick={() => {
          displayColorMaps((prev) => !prev)
        }}
      >
        Select color map
      </Label>
      <div
        className="w-[16rem] ml-1 grid grid-cols-1 gap-1 
          max-h-20 overflow-y-auto overflow-x-hidden
          rounded-md border-emerald-400 border-2"
      >
        {!display_color_maps && (
          <img
            onClick={() => displayColorMaps(true)}
            src={`/assets/colormaps/${colormap_name}`}
            key={0}
            className="w-fit h-9 p-2"
          ></img>
        )}
        {display_color_maps &&
          colormaps_test
            .filter((v) => v != colormap_name)
            .map((name: string, i: number) => (
              <div
                onClick={() => {
                  displayColorMaps(false)
                  onChange(name)
                }}
                className="hover:bg-slate-800"
              >
                <img
                  key={i + 1}
                  src={`/assets/colormaps/${name}`}
                  className="w-fit h-9 p-2"
                />
              </div>
            ))}
      </div>
    </Row>
  )
}
