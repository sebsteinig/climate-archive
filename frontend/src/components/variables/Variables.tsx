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
    
}

export function Variables({}:Props) {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 ml-5 h-1/2 grid grid-rows-6 grid-cols-2 grid-flow-col gap-5 ">
            <Clt  />
            <Currents/>
            <Height />
            <Liconc />
            <Mlotst />
            <Pfts />
            <Pr />
            <Sic />
            <Snc />
            <Tas />
            <Tos />
            <Winds />
        </div>
    )    
}