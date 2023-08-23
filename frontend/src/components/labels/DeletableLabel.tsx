import { PropsWithChildren } from "react"

type Props = {
  onClick: Function
  onRemove: Function
}

export default function Label({
  onClick,
  onRemove,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className="bg-slate-600 text-slate-300 rounded-lg outline-none px-5 py-2 shadow-xl w-fit"
      onClick={() => onClick()}
    >
      {children}
      <div onClick={() => onRemove()}>x</div>
    </div>
  )
}
