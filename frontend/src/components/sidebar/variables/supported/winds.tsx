import { Variable, VariableProps } from "../utils"
import WindsIcon from "$/assets/icons/winds-slate-500.svg"
import WindsGreenIcon from "$/assets/icons/winds-emerald-300.svg"
import { useClusterStore } from "@/utils/store/cluster.store"
import InputNumber from "@/components/inputs/InputNumber"
import Slider from "@/components/inputs/Slider"
import Checkbox from "@/components/inputs/Checkbox"

export function Winds({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const winds = useClusterStore((state) => state.variables.winds)
  return (
    <Variable
      title={winds.name}
      toggle={() => winds.toggle()}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      src={winds.active ? WindsGreenIcon : WindsIcon}
      active={winds.active}
      controls={true}
    >
      <div>
        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> animation speed :</h5>
          <Slider
            min={0}
            max={0.08}
            value={winds.animation_speed}
            onChange={(event: any) => {
              return winds.updateAnimationSpeed(event?.target.value)
            }}
            step={0.0001}
          ></Slider>
          <InputNumber
            value={winds.animation_speed}
            min={0}
            max={0.08}
            onChange={(event: any) => {
              return winds.updateAnimationSpeed(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> min speed [m/s]:</h5>
          <Slider
            min={1}
            max={100}
            value={winds.min_speed}
            onChange={(event: any) => {
              return winds.updateMinSpeed(event?.target.value)
            }}
            step={1}
          ></Slider>
          <InputNumber
            value={winds.min_speed}
            min={1}
            max={100}
            onChange={(event: any) => {
              return winds.updateMinSpeed(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> reference speed [m/s] :</h5>
          <Slider
            min={1}
            max={100}
            value={winds.reference_speed}
            onChange={(event: any) => {
              return winds.updateReferenceSpeed(event?.target.value)
            }}
            step={0.1}
          ></Slider>
          <InputNumber
            value={winds.reference_speed}
            min={1}
            max={100}
            onChange={(event: any) => {
              return winds.updateReferenceSpeed(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> number of arrows :</h5>
          <Slider
            min={0}
            max={100000}
            value={winds.arrows}
            onChange={(event: any) => {
              return winds.updateArrows(event?.target.value)
            }}
            step={100}
          ></Slider>
          <InputNumber
            value={winds.arrows}
            min={0}
            max={100000}
            onChange={(event: any) => {
              return winds.updateArrows(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> size of arrows:</h5>
          <Slider
            min={0}
            max={5}
            value={winds.arrows_size}
            onChange={(event: any) => {
              return winds.updateArrowsSize(event?.target.value)
            }}
            step={0.01}
          ></Slider>
          <InputNumber
            value={winds.arrows_size}
            min={0}
            max={5}
            onChange={(event: any) => {
              return winds.updateArrowsSize(event?.target.value)
            }}
          ></InputNumber>
        </div>

        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> scale by magnitude:</h5>
          <Checkbox
            checked={winds.scale_by_magnitude}
            onChange={() => winds.toggleScaleByMagnitude()}
          ></Checkbox>
        </div>
        <div className="flex flex-wrap gap-2 items-center py-1">
          <h5 className="w-56"> color by magnitude:</h5>
          <Checkbox
            checked={winds.color_by_magnitude}
            onChange={() => winds.toggleColorByMagnitude()}
          ></Checkbox>
        </div>
      </div>
    </Variable>
  )
}
