

import { Label, Row } from "../../filter.utils"
import { useStore } from "@/utils/store/store"
import InputField from "@/components/inputs/InputField"

export function InputConfiguration(){
    const setConfig = useStore(state => state.search.setConfig)
    const filters = useStore(state => state.search.filter.experiment)
    return(
        <Row>
            <Label>Configuration</Label>
            <InputField
                name="config"
                id="config"
                placeholder="configuration ..."
                value={filters.config || ''}
                onChange={(e) => setConfig(e)}
            />
      </Row>
    )
}