import { Variable, VariableProps } from "../Variable"
import { useStore } from "@/utils/store/store"
import { Rows } from "../utils/Rows"
import { ColorMapRow } from "../utils/row.colormap"
import { RowWithSlider } from "../utils/row.slider"
import { RowWithCheckBox } from "../utils/row.checkbox"

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
      <RowWithSlider
          onChange={(n) => {
            height.updateMin(n)
          }}
          min={-10000}
          max={0}
          step={1}
          value={height.min}
          label="ocean depth max [m]"
        />
        <RowWithSlider
          onChange={(n) => {
            height.updateMax(n)
          }}
          min={0}
          max={10000}
          step={1}
          value={height.max}
          label="mountain height max"
        />
        <ColorMapRow
          colormap_name={height.colormap}
          colormap_index={height.colormap_index}
          onChange={(name, index) => height.updateColormap(name, index)} // pass both name and index
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
