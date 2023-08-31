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
        <ColorMapRow
          colormap_name={height.colormap}
          onChange={(n) => height.updateColormap(n)}
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
