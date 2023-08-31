import { Label, Row } from "../../filter.utils"
import { useStore } from "@/utils/store/store"

import Checkbox from "@/components/inputs/Checkbox"

export function CheckLossless() {
  const toggleLossless = useStore((state) => state.search.toggleLossless)
  const filters = useStore((state) => state.search.filter.experiment)
  return (
    <Row>
      <Label>Lossless</Label>
      <Checkbox
        name="lossless"
        id="lossless"
        checked={filters.lossless || false}
        onChange={() => toggleLossless()}
      ></Checkbox>
    </Row>
  )
}
