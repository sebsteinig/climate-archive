import { Variable, VariableProps } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"
import Checkbox from "@/components/inputs/Checkbox"

export function Tos({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const tos = useClusterStore((state) => state.variables.tos)
  return (
    <Variable
      title={tos.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <div>
        <div className="flex flex-wrap gap-2 items-center  py-1">
          <h5 className="w-56"> SST min. [°C]</h5>
          <Slider
            min={-2}
            max={40}
            value={tos.min}
            onChange={(event: any) => {
              return tos.updateMin(parseFloat(event?.target.value))
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={tos.min}
            min={-2}
            max={40}
            onChange={(event: any) => {
              return tos.updateMin(parseFloat(event?.target.value))
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center  py-1">
          <h5 className="w-56"> SST max. [°C]</h5>
          <Slider
            min={-2}
            max={40}
            value={tos.max}
            onChange={(event: any) => {
              return tos.updateMax(parseFloat(event?.target.value))
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={tos.max}
            min={-2}
            max={40}
            onChange={(event: any) => {
              return tos.updateMax(parseFloat(event?.target.value))
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center  py-1">
          <h5 className="w-56"> anomaly range [°C]</h5>
          <Slider
            min={0}
            max={20}
            value={tos.anomaly_range}
            onChange={(event: any) => {
              return tos.updateAnomalyRange(parseFloat(event?.target.value))
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={tos.anomaly_range}
            min={0}
            max={20}
            onChange={(event: any) => {
              return tos.updateAnomalyRange(parseFloat(event?.target.value))
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> mask anomalies below [°C]</h5>
          <Slider
            min={0}
            max={20}
            value={tos.anomalies_lower_bound}
            onChange={(event: any) => {
              return tos.updateAnomaliesLowerBound(
                parseFloat(event?.target.value),
              )
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={tos.anomalies_lower_bound}
            min={0}
            max={20}
            onChange={(event: any) => {
              return tos.updateAnomaliesLowerBound(
                parseFloat(event?.target.value),
              )
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> show sea ice</h5>
          <Checkbox
            checked={tos.sea_ice}
            onChange={() => tos.toggleSeaIce()}
          ></Checkbox>
        </div>
      </div>
    </Variable>
  )
}
