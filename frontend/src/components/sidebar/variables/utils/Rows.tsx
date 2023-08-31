import { PropsWithChildren } from "react"

export function Rows({ children }: PropsWithChildren<{}>) {
  return <div className="flex flex-col gap-5">{children}</div>
}
