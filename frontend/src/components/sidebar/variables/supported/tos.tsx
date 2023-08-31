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
        <ColorMapRow
          colormap_name={tos.colormap}
          onChange={(n) => tos.updateColormap(n)}
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateMin(n)
          }}
          min={-2}
          max={40}
          step={0.1}
          value={tos.min}
          label="SST min. [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateMax(n)
          }}
          min={-2}
          max={40}
          step={0.1}
          value={tos.max}
          label="SST max. [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateAnomalyRange(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={tos.anomaly_range}
          label="anomaly range [°C]"
        />
        <RowWithSlider
          onChange={(n) => {
            tos.updateAnomaliesLowerBound(n)
          }}
          min={0}
          max={20}
          step={0.1}
          value={tos.anomalies_lower_bound}
          label="mask anomalies below [°C]"
        />
        <RowWithCheckBox
          toggle={() => {
            tos.toggleSeaIce()
          }}
          checked={tos.sea_ice}
          label="show sea ice"
        />
      </Rows>
    </Variable>
  )
}
