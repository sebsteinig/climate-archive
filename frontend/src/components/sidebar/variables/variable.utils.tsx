import { EVarID } from "@/utils/store/variables/variable.types"
import WindsIcon from "$/assets/icons/winds-slate-500.svg"
import MountainIcon from "$/assets/icons/mountain-emerald-300.svg"
import TemperatureIcon from "$/assets/icons/temperature-slate-500.svg"
import TreesIcon from "$/assets/icons/trees-slate-500.svg"
import RainIcon from "$/assets/icons/cloud-rain-slate-500.svg"
import WaveIcon from "$/assets/icons/water-slate-500.svg"

export function titleOf(name: EVarID) {
  switch (name) {
    case EVarID.currents:
      return "Currents"
    case EVarID.pr:
      return "Precipitations"
    case EVarID.height:
      return "Surface"
    case EVarID.winds:
      return "Winds"
    case EVarID.tos:
      return "SST"
    case EVarID.pfts:
      return "Vegetation"
    default:
      return ""
  }
}

export function unitOf(name: EVarID) {
  switch (name) {
    case EVarID.currents:
      return ""
    case EVarID.pr:
      return "mm/day"
    case EVarID.height:
      return ""
    case EVarID.winds:
      return ""
    case EVarID.tos:
      return "°C"
    case EVarID.pfts:
      return ""
    default:
      return ""
  }
}

export function IconOf({
  name,
  toggle,
  active,
  className,
}: {
  name: EVarID
  toggle: Function
  active: boolean
  className?: string
}) {
  const _className = `p-1 w-10 h-10 ${
    active ? "text-emerald-500" : "text-slate-500"
  }`
  const _classNameWithChild = `p-1 w-10 h-10 ${
    active
      ? "text-emerald-500 child:fill-emerald-500"
      : "text-slate-500 child:fill-slate-500"
  }`
  switch (name) {
    case EVarID.currents:
      return <WaveIcon onClick={() => toggle()} className={_className} />
    case EVarID.pr:
      return <RainIcon onClick={() => toggle()} className={_className} />
    case EVarID.height:
      return <MountainIcon onClick={() => toggle()} className={_className} />
    case EVarID.winds:
      return (
        <WindsIcon onClick={() => toggle()} className={_classNameWithChild} />
      )
    case EVarID.tos:
      return (
        <TemperatureIcon
          onClick={() => toggle()}
          className={_classNameWithChild}
        />
      )
    case EVarID.pfts:
      return (
        <TreesIcon onClick={() => toggle()} className={_classNameWithChild} />
      )
    default:
      return <></>
  }
}
