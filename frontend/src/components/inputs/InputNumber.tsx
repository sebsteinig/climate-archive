import { PropsWithChildren } from "react"

type Props = {
  value: number
  onChange: Function
  onKeyDown?: Function
  min?: number
  max?: number
  name?: string
  id?: string
}

export default function InputField({
  value,
  min,
  max,
  onChange,
  onKeyDown,
  name,
  id,
}: Props) {
  return (
    <input
      className="bg-slate-600 border-x-4 w-28 text-xs border-r-slate-500 border-l-slate-500
        px-5 py-2 placeholder:text-slate-300/80 outline-none"
      onChange={(e) => onChange(e)}
      onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : {})}
      value={value}
      id={id}
      name={name}
      type="number"
      min={min}
      max={max}
    ></input>
  )
}
