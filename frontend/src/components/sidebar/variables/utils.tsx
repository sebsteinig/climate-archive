import { PropsWithChildren } from "react"
import Image from "next/image"
import { useState } from "react"
import Eye from "$/assets/icons/eye-slate-500.svg"
import EyeClosed from "$/assets/icons/eye-closed-slate-500.svg"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"
import { VariableName } from "@/utils/store/variables/variable.types"

export type VariableProps = {
  current_variable_controls: VariableName | undefined
  setCurrentVariableControls: Function
}

type Props = VariableProps & {
  toggle: Function
  src: any
  controls: boolean
  active: boolean
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

export function Variable({
  toggle,
  src,
  active,
  title,
  controls,
  current_variable_controls,
  setCurrentVariableControls,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`group flex flex-row bg-gray-900 cursor-pointer
         rounded-lg p-2 h-fit w-fit ${
           active ? "shadow-[-1px_4px_4px_rgba(74,222,128,_0.2)]" : ""
         }`}
    >
      <Image
        onClick={() => toggle()}
        priority
        src={src}
        className="w-12 h-12 px-2"
        alt={titleOf(title)}
      />
      <div
        className={
          current_variable_controls === title ? "" : "hidden group-hover:block"
        }
      >
        <div onClick={() => toggle()} className="flex flex-wrap items-center">
          <h3>{titleOf(title)} </h3>
          <Image
            priority
            alt=""
            src={active ? EyeClosed : Eye}
            className="w-8 px-1 ml-2 h-8"
          />
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
              <Image
                priority
                alt="close"
                className={`w-4 h-4 self-center ml-4`}
                src={current_variable_controls === title ? ArrowUp : ArrowDown}
              />
            </h4>
          </div>
        )}
        {current_variable_controls === title && children}
      </div>
    </div>
  )
}
