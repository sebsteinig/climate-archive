import { ColorMapRow, RowWithSlider, Rows, Variable, VariableProps } from "../utils"
import { useStore } from "@/utils/store/store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"

export function Height({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const height = useStore((state) => state.variables.height)
  return (
    <Variable
      title={height.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <ColorMapRow
          colormap_name = {height.colormap}
          onChange = {(n) => height.updateColormap(n)}
        />
        <RowWithSlider
          onChange={(n) => {
            height.updateDiplacement(n)
          }}
          min={0}
          max={0.8}
          step={0.001}
          value={height.diplacement}
          label="height diplacement"
        />
      </Rows>
    </Variable>
  )
}
