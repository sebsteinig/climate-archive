import { Variable } from "../utils"
import RainIcon from "$/assets/icons/cloud-rain-slate-500.svg";
import RainGreenIcon from "$/assets/icons/cloud-rain-emerald-300.svg";
import { useClusterStore } from "@/utils/store/cluster.store";

import Slider from "@/components/inputs/Slider";
import InputNumber from "@/components/inputs/InputNumber";

type Props = {
}

export function Pr({}:Props) {
    const pr = useClusterStore((state) => state.variables.pr)
    return (
        <Variable title = {"Precipitation"} toggle = {() => pr.toggle()} 
            src = {pr.active?RainGreenIcon:RainIcon} active = {pr.active} controls = {true}>
            
            <div>
                <div className="flex flex-wrap gap-2 items-center py-1">
                    <h5 className="w-56"> precip min. [mm/day] :</h5>
                    <Slider min={0} max = {20} value = {pr.min} onChange={(event : any) => {
                        return pr.updateMin(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {pr.min} min={0} max = {20} onChange={(event : any) => {
                        return pr.updateMin(event?.target.value)}}></InputNumber>
                </div>

                <div className="flex flex-wrap gap-2 items-center py-1">
                    <h5 className="w-56"> precip max. [mm/day] :</h5>
                    <Slider min={0} max = {20} value = {pr.max} onChange={(event : any) => {
                        return pr.updateMax(event?.target.value)}} step={0.1}></Slider>
                    <InputNumber value = {pr.max} min={0} max = {20} onChange={(event : any) => {
                        return pr.updateMax(event?.target.value)}}></InputNumber>
                </div> 
            </div>
        </Variable> 
    )
}
