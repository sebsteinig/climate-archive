import { PropsWithChildren } from "react"

type Props = {
  onClick: Function
  disabled?: boolean
  className?: string
}

export default function ButtonPrimary({
  onClick,
  disabled,
  children,
  className,
}: PropsWithChildren<Props>) {
  return (
    <button
      className={`bg-emerald-500 text-slate-800 rounded-lg hover:bg-emerald-400
        outline-none px-5 py-2 font-medium tracking-[.5em] uppercase shadow-2xl shadow-slate-950 disabled:opacity-30  ${
          className ?? ""
        }`}
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
