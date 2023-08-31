import { PropsWithChildren } from "react"

type Props = {
  value?: string
  defaultValue?: string[]
  onChange: (e: string) => void
  name?: string
  id?: string
}

export default function MultiSelect({
  onChange,
  name,
  id,
  defaultValue,
  children,
}: PropsWithChildren<Props>) {
  return (
    <select
      className="bg-slate-600  px-5 py-2 border-r-slate-500 
        border-l-slate-500 border-x-4 outline-none"
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
      id={id}
      name={name}
      multiple
    >
      {children}
    </select>
  )
}
