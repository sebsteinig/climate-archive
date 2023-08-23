import { PropsWithChildren } from "react"

type Props = {
  onClick: Function
}

export default function Label({ onClick, children }: PropsWithChildren<Props>) {
  return (
    <div
      onClick={() => onClick()}
      className="bg-slate-600 text-slate-300 rounded-lg outline-none px-5 py-2 shadow-xl w-fit"
    >
      {children}
    </div>
  )
}
