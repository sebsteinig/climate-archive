import { ChangeEvent, PropsWithChildren } from "react"

type Props = {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value?: string
  defaultValue?: string
  className?: string
  name?: string
  id?: string
  title?: string
}

export default function Select({
  onChange,
  name,
  id,
  className,
  title,
  value,
  defaultValue,
  children,
}: PropsWithChildren<Props>) {
  return (
    <select
      className={`bg-slate-600  px-5 py-2 border-r-slate-500 truncate w-full border-l-slate-500 border-x-4 placeholder:text-slate-300/80 outline-none ${
          className ?? ""
        }`}
      onChange={(e) => onChange(e)}
      title={title}
      defaultValue={defaultValue}
      value={value}
      id={id}
      name={name}
    >
      {children}
    </select>
  )
}
