import Checkbox from "@/components/inputs/Checkbox"
import { Label, Row } from "@/components/searchbar/filters/filter.utils"

type RowWithCheckBoxProps = {
  toggle: () => void
  label: string
  checked: boolean
}

export function RowWithCheckBox(props: RowWithCheckBoxProps) {
  return (
    <Row>
      <Label>{props.label}</Label>
      <div className="grow-[2]">
        <Checkbox checked={props.checked} onChange={() => props.toggle()} />
      </div>
    </Row>
  )
}
