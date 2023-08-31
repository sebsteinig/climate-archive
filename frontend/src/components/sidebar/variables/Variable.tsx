import { PropsWithChildren, useState } from "react"
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
import { useStore } from "@/utils/store/store"
import { IconOf, titleOf } from "./variable.utils"

export type VariableProps = {
  current_variable_controls: EVarID | undefined
  setCurrentVariableControls: Function
}

type Props = VariableProps & {
  controls: boolean
  title: EVarID
}

export function Variable({
  title,
  controls,
  current_variable_controls,
  setCurrentVariableControls,
  children,
}: PropsWithChildren<Props>) {
  const active_variables = useStore((state) => state.active_variables)
  const activate = useStore((state) => state.activate)
  return (
    <div
      className={`group flex flex-row 
       bg-gray-900 cursor-pointer w-fit h-fit gap-5
         rounded-lg p-2 z-30 ${
           active_variables.get(title)
             ? "shadow-[-1px_4px_4px_rgba(74,222,128,_0.2)]"
             : ""
         }`}
      onClick={() => current_variable_controls != title ?? activate(title)}
    >
      <div className="shrink-0 grow-0 ">
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
            onClick={() => {
              setCurrentVariableControls(
                current_variable_controls === title ? undefined : title,
              )
            }}
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
