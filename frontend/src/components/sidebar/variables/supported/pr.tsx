import { ColorMapRow, RowWithSlider, Rows, Variable, VariableProps } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"

import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"

export function Pr({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const pr = useClusterStore((state) => state.variables.pr)
  return (
    <Variable
      title={pr.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <ColorMapRow
          colormap_name = {pr.colormap}
          onChange = {(n) => pr.updateColormap(n)}
        />
        <RowWithSlider
          onChange={(n) => {
            pr.updateMin(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={pr.min}
          label="precip min. [mm/day]"
        />
        <RowWithSlider
          onChange={(n) => {
            pr.updateMax(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={pr.max}
          label="precip max. [mm/day]"
        />
      </Rows>
    </Variable>
  )
}
