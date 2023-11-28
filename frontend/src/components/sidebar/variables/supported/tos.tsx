import { Variable, VariableProps } from "../Variable"
import { useStore } from "@/utils/store/store"
import { Rows } from "../utils/Rows"
import { ColorMapRow } from "../utils/row.colormap"
import { RowWithSlider } from "../utils/row.slider"
import { RowWithCheckBox } from "../utils/row.checkbox"

export function Tos({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const tos = useStore((state) => state.variables.tos)
  return (
    <Variable
      title={tos.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <RowWithSlider
          onChange={(n) => {
            tos.updateMin(n)
          }}
          min={-2}
          max={50}
          step={0.1}
          value={tos.min}
          label="min [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateMax(n)
          }}
          min={-2}
          max={50}
          step={0.1}
          value={tos.max}
          label="max [°C]"
        />
        <ColorMapRow
          colormap_name={tos.colormap}
          colormap_index={tos.colormap_index}
          onChange={(name, index) => tos.updateColormap(name, index)} // pass both name and index
          />
        <RowWithSlider
          onChange={(n) => {
            tos.updateAnomalyMin(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={tos.anomaly_min}
          label="anomaly min [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateAnomalyMax(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={tos.anomaly_max}
          label="anomaly max [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateOpacity(n)
          }}
          min={0}
          max={1.0}
          step={0.01}
          value={tos.opacity}
          label="opacity"
        />
      </Rows>
    </Variable>
  )
}
