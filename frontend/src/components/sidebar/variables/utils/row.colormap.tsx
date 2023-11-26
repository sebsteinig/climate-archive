import { Label, Row } from "@/components/searchbar/filters/filter.utils"
import { useState, useMemo } from "react"
import colormaps_list from "$/assets/colormaps/colormaps_list.json"

type ColorMapRowProps = {
  colormap_name: string
  colormap_index: number
  onChange: (name: string, index: number) => void
}

export function ColorMapRow({ colormap_name, onChange }: ColorMapRowProps) {
  const [display_color_maps, displayColorMaps] = useState<boolean>(false)


  const sortedColormaps = useMemo(() => {
    return [...colormaps_list];
  }, []);

  return (
    <Row>
      <Label
        onClick={() => {
          displayColorMaps((prev) => !prev)
        }}
      >
        colormap
      </Label>
      <div
        className={`w-[16rem] ml-1 grid ${display_color_maps ? 'grid-cols-2' : 'grid-cols-1'} gap-1 
        max-h-30 overflow-y-auto overflow-x-hidden
        rounded-md border-emerald-400 border-2 pixelated`}
      >
        {!display_color_maps && (
          <img
            onClick={() => displayColorMaps(true)}
            src={`/assets/colormaps/${colormap_name}`}
            key={0}
            className="w-fit h-9 p-2 grid-cols-1"
          ></img>
        )}
        {display_color_maps &&
          sortedColormaps
            .map((name: string, i: number) => {
              const filenameWithoutExtension = name.replace(".png", "");
              return (
                <div
                  onClick={() => {
                    displayColorMaps(false);
                    onChange(name, i);
                  }}
                  onMouseOver={() => {
                    onChange(name, i);
                    console.log(name);
                  }}
                  key={i}
                  className={`hover:bg-slate-800 ${name === colormap_name ? 'bg-slate-700' : ''}`}
                >
                  <img
                    src={`/assets/colormaps/${name}`}
                    className="w-fit h-9 p-2 pixelated"
                    title={filenameWithoutExtension} // tooltip showing the filename without the .png
                  />
                </div>
              );
            })}

      </div>
    </Row>
  )
}
