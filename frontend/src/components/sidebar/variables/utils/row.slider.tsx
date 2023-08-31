import InputNumber from "@/components/inputs/InputNumber"
import Slider from "@/components/inputs/Slider"
import { Label, Row } from "@/components/searchbar/filters/filter.utils"

type RowWithSliderProps = {
  onChange: (number: number) => void
  label: string
  min: number
  max: number
  step?: number
  value: number
}

export function RowWithSlider(props: RowWithSliderProps) {
  return (
    <Row>
      <Label>{props.label}</Label>
      <Slider
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={props.onChange}
        step={props.step}
        className="accent-emerald-400"
      ></Slider>
      <InputNumber
        value={props.value}
        min={props.min}
        max={props.max}
        onChange={props.onChange}
      ></InputNumber>
    </Row>
  )
}
