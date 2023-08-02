import { Variable, VariableProps } from "../utils"
import { useClusterStore } from "@/utils/store/cluster.store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"

export function Height({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const height = useClusterStore((state) => state.variables.height)
  return (
    <Variable
      title={height.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <div>
        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> height diplacement</h5>
          <Slider
            min={0}
            max={0.8}
            value={height.diplacement}
            onChange={(event: any) => {
              return height.updateDiplacement(parseFloat(event?.target.value))
            }}
            step={0.001}
          ></Slider>
          <InputNumber
            value={height.diplacement}
            min={0}
            max={0.8}
            onChange={(event: any) => {
              return height.updateDiplacement(parseFloat(event?.target.value))
            }}
          ></InputNumber>
        </div>
      </div>
    </Variable>
  )
}
