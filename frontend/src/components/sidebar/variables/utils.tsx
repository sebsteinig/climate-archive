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
import { VariableName } from "@/utils/store/variables/variable.types"
import { useClusterStore } from "@/utils/store/cluster.store"

export type VariableProps = {
  current_variable_controls: VariableName | undefined
  setCurrentVariableControls: Function
}

type Props = VariableProps & {
  controls: boolean
  title: VariableName
}

function titleOf(name: VariableName) {
  switch (name) {
    case VariableName.currents:
      return "Currents"
    case VariableName.pr:
      return "Precipitations"
    case VariableName.height:
      return "Surface"
    case VariableName.winds:
      return "Winds"
    case VariableName.tos:
      return "SST"
    case VariableName.pfts:
      return "Vegetation"
    default:
      return ""
  }
}

function IconOf({
  name,
  toggle,
  active,
}: {
  name: VariableName
  toggle: Function
  active: boolean
}) {
  const className = `w-10 h-10 px-1 ${active ? "text-emerald-400" : "text-slate-500"}`
  const classNameWithChild = `w-10 h-10 px-1 ${active ? "text-emerald-400 child:fill-emerald-400" : "text-slate-500 child:fill-slate-500"}`
  switch (name) {
    case VariableName.currents:
      return (
        <WaveIcon
          onClick={() => toggle()}
          className={className}
        />
      )
    case VariableName.pr:
      return (
        <RainIcon
          onClick={() => toggle()}
          className={className}
        />
      )
    case VariableName.height:
      return (
        <MountainIcon
          onClick={() => toggle()}
          className={className}
        />
      )
    case VariableName.winds:
      return (
        <WindsIcon
          onClick={() => toggle()}
          className={classNameWithChild}
        />
      )
    case VariableName.tos:
      return (
        <TemperatureIcon
          onClick={() => toggle()}
          className={classNameWithChild}
        />
      )
    case VariableName.pfts:
      return (
        <TreesIcon
          onClick={() => toggle()}
          className={classNameWithChild}
        />
      )
    default:
      return ""
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
       bg-gray-900 cursor-pointer
         rounded-lg p-2 h-fit w-fit z-30 ${
          active_variables.get(title) ? "shadow-[-1px_4px_4px_rgba(74,222,128,_0.2)]" : ""
         }`}
    >
      <IconOf name={title} active={active_variables.get(title)!} toggle={() => activate(title)} />
      <div
        className={
          current_variable_controls === title ? "" : "hidden group-hover:block"
        }
      >
        <div onClick={() => activate(title)} className="flex flex-wrap items-center">
          <h3>{titleOf(title)} </h3>
          {active_variables.get(title) ? (
            <EyeClosed className="w-8 text-slate-500 px-1 ml-2 h-8" />
          ) : (
            <Eye className="w-8 text-slate-500 px-1 ml-2 h-8" />
          )}
        </div>
        {controls && (
          <div className="flex flex-wrap">
            <h4
              className="inline-flex"
              onClick={() => {
                setCurrentVariableControls(
                  current_variable_controls === title ? undefined : title,
                )
              }}
            >
              {current_variable_controls === title
                ? "Close controls"
                : "Open controls"}
              {current_variable_controls === title ? (
                <ArrowUp
                  className={`text-emerald-400 w-4 h-4 self-center ml-4 child:fill-emerald-400`}
                />
              ) : (
                <ArrowDown
                  className={`text-emerald-400 w-4 h-4 self-center ml-4 child:fill-emerald-400`}
                />
              )}
            </h4>
          </div>
        )}
        {current_variable_controls === title && children}
      </div>
    </div>
  )
}
