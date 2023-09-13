import { Variable, VariableProps } from "../Variable"
import { useStore } from "@/utils/store/store"
import { Rows } from "../utils/Rows"
import { ColorMapRow } from "../utils/row.colormap"
import { RowWithSlider } from "../utils/row.slider"
import { RowWithCheckBox } from "../utils/row.checkbox"

export function Pr({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const pr = useStore((state) => state.variables.pr)
  return (
    <Variable
      title={pr.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <ColorMapRow
          colormap_name={pr.colormap}
          colormap_index={pr.colormap_index}
          onChange={(name, index) => pr.updateColormap(name, index)} // pass both name and index
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
