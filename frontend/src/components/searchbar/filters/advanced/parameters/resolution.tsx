import { useEffect, useState } from "react"
import { Label, Row } from "../../filter.utils"
import Select from "@/components/inputs/Select"
import { useStore } from "@/utils/store/store"

const SUPPORTED_RESOLUTION = ["default", 1, 2] as const

export function SelectResolution() {
  const [x, setX] = useState("")
  const [y, setY] = useState("")
  const setResolution = useStore((state) => state.search.setResolution)

  useEffect(() => {
    if (x && y) {
      const rx = parseFloat(x)
      const ry = parseFloat(y)
      setResolution(rx, ry)
    }
  }, [x, y])

  return (
    <Row>
      <Label>Resolution</Label>
      <h5>x</h5>
      <Select
        name="rx"
        id="rx"
        defaultValue={SUPPORTED_RESOLUTION[0].toString()}
        onChange={(e) => {
          const x =
            e.target.value == SUPPORTED_RESOLUTION[0] ? "0" : e.target.value
          setX(x)
        }}
      >
        {SUPPORTED_RESOLUTION.map((ext, idx) => {
          return (
            <option value={ext} key={idx}>
              {ext}
            </option>
          )
        })}
      </Select>

      <h5>y</h5>
      <Select
        name="ry"
        id="ry"
        defaultValue={SUPPORTED_RESOLUTION[0].toString()}
        onChange={(e: any) => {
          const y =
            e.target.value == SUPPORTED_RESOLUTION[0] ? "0" : e.target.value
          setY(y)
        }}
      >
        {SUPPORTED_RESOLUTION.map((ext, idx) => {
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
