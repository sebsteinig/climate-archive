import { PropsWithChildren } from "react"
import WindsIcon from "$/assets/icons/winds-slate-500.svg"
import MountainIcon from "$/assets/icons/mountain-emerald-300.svg"
import TemperatureIcon from "$/assets/icons/temperature-slate-500.svg"
import TreesIcon from "$/assets/icons/trees-slate-500.svg"
import RainIcon from "$/assets/icons/cloud-rain-slate-500.svg"
import WaveIcon from "$/assets/icons/water-slate-500.svg"
import Eye from "$/assets/icons/eye-slate-500.svg"
import EyeClosed from "$/assets/icons/eye-closed-slate-500.svg"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import { EVarID } from "@/utils/store/variables/variable.types"
import { useClusterStore } from "@/utils/store/cluster.store"
import Slider from "@/components/inputs/Slider"
import InputNumber from "@/components/inputs/InputNumber"
import Checkbox from "@/components/inputs/Checkbox"

export type VariableProps = {
  current_variable_controls: EVarID | undefined
  setCurrentVariableControls: Function
}

type Props = VariableProps & {
  controls: boolean
  title: EVarID
}

function titleOf(name: EVarID) {
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

function IconOf({
  name,
  toggle,
  active,
  className
}: {
  name: EVarID
  toggle: Function
  active: boolean
  className?:string
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
      return <WaveIcon onClick={() => toggle()} className={_className}/>
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

export function Variable({
  title,
  controls,
  current_variable_controls,
  setCurrentVariableControls,
  children,
}: PropsWithChildren<Props>) {
  const active_variables = useClusterStore((state) => state.active_variables)
  const activate = useClusterStore((state) => state.activate)
  return (
    <div
      className={`group flex flex-row 
       bg-gray-900 cursor-pointer w-fit h-fit gap-5
         rounded-lg p-2 z-30 ${
           active_variables.get(title)
             ? "shadow-[-1px_4px_4px_rgba(74,222,128,_0.2)]"
             : ""
         }`}
    >
      <div className="grow-0">
        <IconOf
          name={title}
          active={active_variables.get(title)!}
          toggle={() => activate(title)}
        />
      </div>
      <div
        className={
          current_variable_controls === title ? "" : "hidden group-hover:block"
        }
      >
        <div
          onClick={() => activate(title)}
          className="flex flex-row justify-between items-center"
        >
          <h3 className="tracking-[.5em] small-caps">{titleOf(title)} </h3>
          <div className="ml-5">
            {active_variables.get(title) ? (
              <EyeClosed className="w-8 text-slate-500 h-8" />
            ) : (
              <Eye className="w-8 text-slate-500 h-8" />
            )}
          </div>
        </div>
        {controls && (
          <div 
            className="flex gap-5 w-fit items-center"               
            onClick={
              () => {
                setCurrentVariableControls(
                  current_variable_controls === title ? undefined : title,
                )
              }
            }
          >
            <h4 className="tracking-widest w-fit whitespace-nowrap">
              {current_variable_controls === title
                ? "Close controls"
                : "Open controls"}
            </h4>
            <div className="mx-2">
              {current_variable_controls === title ? (
                <ArrowUp
                  className={`text-slate-500 w-5 h-5 self-center  child:fill-slate-500`}
                />
              ) : (
                <ArrowDown
                  className={`text-slate-500 w-5 h-5 self-center child:fill-slate-500`}
                />
              )}
            </div>
          </div>
        )}
        <br />
        <div className="mr-5">
            {current_variable_controls === title && children}
        </div>
      </div>
    </div>
  )
}


export function Label({children,className}:PropsWithChildren<{className?:string}>) {
  return (
    <>
      <h5 className={`flex-grow capitalize truncate whitespace-nowrap ${className ?? ''}`}>{children}</h5>
      <h5>:</h5>
    </>
  )
}

export function Row({children}:PropsWithChildren<{}>) {
  return <div className="flex flex-row gap-5 justify-between">
    {children}
  </div>
}

type RowWithSliderProps = {
  onChange : (number:number) => void
  label:string
  min:number
  max:number
  step ?: number
  value : number
}

export function RowWithSlider(props:RowWithSliderProps) {
  return (
    <Row>
      <Label>{props.label}</Label>
      <Slider
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={props.onChange}
        step={props.step}
      ></Slider>
      <InputNumber
        value={props.value}
        min={props.min}
        max={props.max}
        onChange={props.onChange}
      ></InputNumber>
    </Row>
  )
}

type RowWithCheckBoxProps = {
  toggle : () => void
  label:string
  checked: boolean
}

export function RowWithCheckBox(props:RowWithCheckBoxProps) {
  return (
    <Row>
      <Label>{props.label}</Label>
      <div className="grow-[2]">
      <Checkbox
          checked={props.checked}
          onChange={() => props.toggle()}
        />
      </div>
    </Row>
  )
}

export function Rows({children}:PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col gap-5">
      {children}
    </div>
  )
}