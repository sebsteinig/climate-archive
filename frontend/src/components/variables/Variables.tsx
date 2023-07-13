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
        <div className="absolute
                        top-1/2 -translate-y-1/2 left-0 ml-5 h-3/4">            
            <div className="overflow-y-auto overflow-x-hidden max-h-full">
                <div className="px-2 py-2 grid grid-rows-12 gap-5">
                    <Winds />
                    <Pr />
                    <Height />
                    <Pfts />
                    <Tos />
                    <Currents/>
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