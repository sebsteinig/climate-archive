import { PropsWithChildren } from "react"

type Props = {
  min: number
  max: number
  value: number
  onChange: (number: number) => void
  step?: number
  onKeyDown?: Function
  name?: string
  id?: string
}

export default function Slider({
  min,
  max,
  value,
  step,
  onChange,
  onKeyDown,
  name,
  id,
}: Props) {
  return (
    <input
      className="bg-slate-600 w-32 web"
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : {})}
      min={min}
      max={max}
      value={value}
      step={step}
      id={id}
      name={name}
      type="range"
    ></input>
  )
}
