import { Variable, VariableProps } from "../utils"
import WaveIcon from "$/assets/icons/water-slate-500.svg"
import WaveGreenIcon from "$/assets/icons/water-emerald-300.svg"
import { useClusterStore } from "@/utils/store/cluster.store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"
import Checkbox from "@/components/inputs/Checkbox"
import { VariableName } from "@/utils/store/variables/variable.types"

export function Currents({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const currents = useClusterStore((state) => state.variables.currents)
  return (
    <Variable
      title={currents.name}
      toggle={() => currents.toggle()}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      src={currents.active ? WaveGreenIcon : WaveIcon}
      active={currents.active}
      controls={true}
    >
      <div>
        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> animation speed </h5>
          <Slider
            min={0}
            max={0.1}
            value={currents.animation_speed}
            onChange={(event: any) => {
              return currents.updateAnimationSpeed(event?.target.value)
            }}
            step={0.0001}
          ></Slider>
          <InputNumber
            value={currents.animation_speed}
            min={0}
            max={0.1}
            onChange={(event: any) => {
              return currents.updateAnimationSpeed(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> reference speed [cm/s]</h5>
          <Slider
            min={1}
            max={100}
            value={currents.reference_speed}
            onChange={(event: any) => {
              return currents.updateReferenceSpeed(event?.target.value)
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={currents.reference_speed}
            min={1}
            max={100}
            onChange={(event: any) => {
              return currents.updateReferenceSpeed(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> number of arrows </h5>
          <Slider
            min={0}
            max={5}
            value={currents.arrows}
            onChange={(event: any) => {
              return currents.updateArrows(event?.target.value)
            }}
            step={0.01}
          ></Slider>
          <InputNumber
            value={currents.arrows}
            min={0}
            max={5}
            onChange={(event: any) => {
              return currents.updateArrows(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> size of arrows</h5>
          <Slider
            min={0}
            max={5}
            value={currents.arrows_size}
            onChange={(event: any) => {
              return currents.updateArrowsSize(event?.target.value)
            }}
            step={0.01}
          ></Slider>
          <InputNumber
            value={currents.arrows_size}
            min={0}
            max={5}
            onChange={(event: any) => {
              return currents.updateArrowsSize(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> scale by magnitude</h5>
          <Checkbox
            checked={currents.scale_by_magnitude}
            onChange={() => currents.toggleScaleByMagnitude()}
          ></Checkbox>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> color by magnitude</h5>
          <Checkbox
            checked={currents.color_by_magnitude}
            onChange={() => currents.toggleColorByMagnitude()}
          ></Checkbox>
        </div>
      </div>
    </Variable>
  )
}
