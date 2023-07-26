import { useClusterStore } from "@/utils/store/cluster.store"
import {
  ForwardRefExoticComponent,
  RefAttributes,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import Main from "../../3D_components/Main"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { TimeFrame } from "@/utils/store/time/time.type"

type Props = {
  onChange: (value: number) => void
  min: number
  max: number
  className?: string
}

export type InputRef = {
  onChange:(frame:TimeFrame) => void
}

export const TimeSlider = forwardRef<InputRef, Props>(
  function TimeSlider({ min, max, className, onChange }: Props, ref) {
    useImperativeHandle(ref,
      ()=>{
        return {
          onChange : (frame:TimeFrame) => {

          }
        }
      }
    )
    return (
      <div className={className}>
        <input
          //ref={ref}
          type="range"
          className="w-full"
          min={min}
          max={max}
          onChange={(e) => {
            onChange(parseInt(e.target.value))
          }}
        />
      </div>
    )
  },
)

export function useTimeSlider(): [
  RefObject<HTMLInputElement>,
  (v: number) => void,
] {
  const input_ref = useRef<HTMLInputElement>(null)
  const update = (value: number) => {
    if (input_ref.current) {
      input_ref.current.value = value.toString()
    }
  }

  return [input_ref, update]
}
