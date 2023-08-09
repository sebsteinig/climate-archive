import {
  RowWithCheckBox,
  RowWithSlider,
  Rows,
  Variable,
  VariableProps,
} from "../utils"
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
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <RowWithSlider
          onChange={(n) => {
            winds.updateAnimationSpeed(n)
          }}
          min={0}
          max={0.08}
          step={0.0001}
          value={winds.animation_speed}
          label="animation speed"
        />
        <RowWithSlider
          onChange={(n) => {
            winds.updateMinSpeed(n)
          }}
          min={1}
          max={100}
          step={1}
          value={winds.min_speed}
          label="min speed [m/s]"
        />
        <RowWithSlider
          onChange={(n) => {
            winds.updateReferenceSpeed(n)
          }}
          min={1}
          max={100}
          step={0.1}
          value={winds.reference_speed}
          label="reference speed [m/s]"
        />
        <RowWithSlider
          onChange={(n) => {
            winds.updateArrows(n)
          }}
          min={0}
          max={100000}
          step={100}
          value={winds.arrows}
          label="number of arrows"
        />
        <RowWithSlider
          onChange={(n) => {
            winds.updateArrowsSize(n)
          }}
          min={0}
          max={5}
          step={0.01}
          value={winds.arrows_size}
          label="size of arrows"
        />
        <RowWithCheckBox
          toggle={() => {
            winds.toggleScaleByMagnitude()
          }}
          checked={winds.scale_by_magnitude}
          label="scale by magnitude"
        />
        <RowWithCheckBox
          toggle={() => {
            winds.toggleColorByMagnitude()
          }}
          checked={winds.color_by_magnitude}
          label="color by magnitude"
        />
      </Rows>
    </Variable>
  )
}
