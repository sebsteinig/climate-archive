import { EVarID } from "@/utils/store/variables/variable.types"
import { Clt } from "./supported/clt"
import { Currents } from "./supported/currents"
import { Height } from "./supported/height"
import { Liconc } from "./supported/liconc"
import { Mlotst } from "./supported/mlotst"
import { Pfts } from "./supported/pfts"
import { Pr } from "./supported/pr"
import { Sic } from "./supported/sic"
import { Snc } from "./supported/snc"
import { Tas } from "./supported/tas"
import { Tos } from "./supported/tos"
import { Winds } from "./supported/winds"

type Props = {
  current_variable_controls: EVarID | undefined
  setCurrentVariableControls: ( e : EVarID )=> void
}

export function Variables({
  current_variable_controls,
  setCurrentVariableControls,
}: Props) {
  return (
    <div className="h-full">
      <div className="overflow-y-auto overflow-x-hidden max-h-full">
        <div className="flex flex-col gap-5">
          <Winds
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          <Pr
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          <Height
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          <Pfts
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          <Tos
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          <Currents
            current_variable_controls={current_variable_controls}
            setCurrentVariableControls={setCurrentVariableControls}
          />
          {/* <Liconc />
              <Clt  />
              <Mlotst />
              <Sic />
              <Snc />
              <Tas /> */}
        </div>
      </div>
    </div>
  )
}
