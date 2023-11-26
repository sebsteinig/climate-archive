import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { useStore } from "@/utils/store/store"
import { Label, Row } from "../../filter.utils"
import Select from "@/components/inputs/Select"

const DEFAULT_LOWER = "jurassic"
const DEFAULT_UPPER = "now"
const DEFAULT_LOWER_BOUND = 1970
const LOWER_PERIOD = rangeYear(
  DEFAULT_LOWER_BOUND,
  new Date().getFullYear(),
  DEFAULT_LOWER,
  false,
)
const UPPER_PERIOD = rangeYear(
  DEFAULT_LOWER_BOUND,
  new Date().getFullYear(),
  DEFAULT_UPPER,
  true,
)

export function Period() {
  const year_span = useStore(
    (state) => state.search.filter.publication.year_span,
  )
  const from = useStore((state) => state.search.setFrom)
  const to = useStore((state) => state.search.setTo)
  const toggle = useStore((state) => state.search.togglePeriod)
  return (
    <Row>
      <Label>Year</Label>
      <ButtonSecondary
        onClick={() => {
          toggle()
        }}
      >
        {year_span.period ? "Between" : "Exactly"}
      </ButtonSecondary>
      {year_span.period ? (
        <>
          <div className="w-1/5">
            <Select
              value={`${year_span.from || DEFAULT_LOWER}`}
              name="period_lower"
              id="period_lower"
              onChange={(e: any) => {
                from(parseInt(e.target.value))
              }}
            >
              {LOWER_PERIOD.map((year, index) => {
                let year_value =
                  year === DEFAULT_LOWER ? DEFAULT_LOWER_BOUND : parseInt(year)
                return (
                  <option key={index} value={year_value}>
                    {year}
                  </option>
                )
              })}
            </Select>
          </div>
          <h4> and </h4>
        </>
      ) : null}
      <div className="w-1/5">
        <Select
          value={`${year_span.to || DEFAULT_UPPER}`}
          name="period_upper"
          id="period_upper"
          onChange={(e: any) => {
            to(parseInt(e.target.value))
          }}
        >
          {UPPER_PERIOD.map((year, index) => {
            let year_value =
              year === DEFAULT_UPPER ? new Date().getFullYear() : parseInt(year)
            return (
              <option key={index} value={year_value}>
                {year}
              </option>
            )
          })}
        </Select>
      </div>
    </Row>
  )
}

function rangeYear(
  startAt: number,
  endAt: number,
  default_value: string,
  reverse: boolean,
) {
  let res = [default_value]
  if (!reverse) {
    for (let index = startAt; index <= endAt; index++) {
      res.push(index.toString())
    }
  } else {
    for (let index = endAt; index >= startAt; index--) {
      res.push(index.toString())
    }
  }
  return res
}
