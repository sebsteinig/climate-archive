import Select from "@/components/inputs/Select"
import { Label, Row } from "../../filter.utils"
import { useStore } from "@/utils/store/store"

const SUPPORTED_EXTENSION = ["webp", "png", "jpg"] as const

export function SelectExtension() {
  const setExtension = useStore((state) => state.search.setExtension)
  const filters = useStore((state) => state.search.filter.experiment)
  return (
    <Row>
      <Label>Extension</Label>
      <Select
        name="extension"
        id="extension"
        defaultValue={filters.extension || SUPPORTED_EXTENSION[0]}
        onChange={(e) => setExtension(e.target.value)}
      >
        {SUPPORTED_EXTENSION.map((ext, idx) => {
          return (
            <option value={ext} key={idx}>
              {ext}
            </option>
          )
        })}
      </Select>
    </Row>
  )
}
