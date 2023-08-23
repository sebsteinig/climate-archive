import {
  ColorMapRow,
  RowWithCheckBox,
  RowWithSlider,
  Rows,
  Variable,
  VariableProps,
} from "../utils"
import { useStore } from "@/utils/store/store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"
import Checkbox from "@/components/inputs/Checkbox"

export function Currents({
  current_variable_controls,
  setCurrentVariableControls,
}: VariableProps) {
  const currents = useStore((state) => state.variables.currents)
  return (
    <Variable
      title={currents.name}
      current_variable_controls={current_variable_controls}
      setCurrentVariableControls={setCurrentVariableControls}
      controls={true}
    >
      <Rows>
        <ColorMapRow
          colormap_name={currents.colormap}
          onChange={(n) => currents.updateColormap(n)}
        />
        <RowWithSlider
          onChange={(n) => {
            currents.updateAnimationSpeed(n)
          }}
          min={0}
          max={0.1}
          step={0.0001}
          value={currents.animation_speed}
          label="animation speed"
        />
        <RowWithSlider
          onChange={(n) => {
            currents.updateReferenceSpeed(n)
          }}
          min={1}
          max={100}
          step={0.1}
          value={currents.reference_speed}
          label="reference speed [cm/s]"
        />
        <RowWithSlider
          onChange={(n) => {
            currents.updateArrows(n)
          }}
          min={0}
          max={5}
          step={0.01}
          value={currents.arrows}
          label="number of arrows"
        />
        <RowWithSlider
          onChange={(n) => {
            currents.updateArrowsSize(n)
          }}
          min={0}
          max={5}
          step={0.01}
          value={currents.arrows_size}
          label="size of arrows"
        />
        <RowWithCheckBox
          toggle={() => {
            currents.toggleScaleByMagnitude()
          }}
          checked={currents.scale_by_magnitude}
          label="scale by magnitude"
        />
        <RowWithCheckBox
          toggle={() => {
            currents.toggleColorByMagnitude()
          }}
          checked={currents.color_by_magnitude}
          label="color by magnitude"
        />
      </Rows>
    </Variable>
  )
}
