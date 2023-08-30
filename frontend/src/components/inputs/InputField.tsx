import { PropsWithChildren } from "react"

type Props = {
  placeholder: string
  value: string
  onChange: (value:string) => void
  onKeyDown?: (e: string) => void
  name?: string
  id?: string
}

export default function InputField({
  placeholder,
  value,
  onChange,
  onKeyDown,
  name,
  id,
}: Props) {
  return (
    <input
      className="bg-slate-600 border-x-4 w-full border-r-sky-600 border-l-emerald-400 
        px-5 py-2 placeholder:text-slate-300/80 outline-none"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => (onKeyDown ? onKeyDown(e.key) : {})}
      placeholder={placeholder}
      value={value}
      id={id}
      name={name}
      type="text"
    ></input>
  )
}
