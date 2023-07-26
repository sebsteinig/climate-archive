import { PropsWithChildren } from "react"

type Props = {
  onClick: Function
  disabled?: boolean
}

export default function ButtonPrimary({
  onClick,
  disabled,
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      className="bg-sky-600 text-slate-100 rounded-lg hover:bg-sky-500
        outline-none px-5 py-2 uppercase tracking-widest shadow disabled:opacity-30"
      onClick={() => onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
