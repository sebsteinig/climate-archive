
import MultiSelect from "@/components/inputs/MultiSelect"
import { Label, Row } from "../../filter.utils"
import { useStore } from "@/utils/store/store"

const SUPPORTED_VARIABLES = [
    "clt",
    "height",
    "mlotst",
    "pr",
    "sic",
    "tas",
    "currents",
    "liconc",
    "pfts",
    "snc",
    "tos",
    "winds",
  ] as const
  

  
export function SelectVariable(){
    const pushVar = useStore(state => state.search.pushVar)
    const removeVar = useStore(state => state.search.removeVar)
    return (
        <Row>
            <Label>Variables</Label>
            <MultiSelect
                name="variables"
                id="variables"
                defaultValue={[]}
                onChange={(e) =>
                pushVar(e)
                }
            >
                {SUPPORTED_VARIABLES.map((ext, idx) => {
                return (
                    <option value={ext} key={idx}>
                    {ext}
                    </option>
                )
                })}
        </MultiSelect>
      </Row>
    )
}