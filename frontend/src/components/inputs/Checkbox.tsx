import { PropsWithChildren } from "react"

type Props = {
  checked: boolean
  onChange: Function
  name?: string
  id?: string
}

export default function Checkbox({ checked, onChange, name, id }: Props) {
  return (
    <input
      className="bg-slate-600 border-2 border-slate-500 checked:bg-sky-400
         w-5 h-5 outline-none appearance-none rounded"
      onChange={(e) => onChange(e)}
      checked={checked}
      id={id}
      name={name}
      type="checkbox"
    ></input>
  )
}
