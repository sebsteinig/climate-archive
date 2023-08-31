import React from "react"
import { PropsWithChildren } from "react"

export function Row({ children }: PropsWithChildren<{}>) {
  return <div className="flex flex-row gap-5 justify-between">{children}</div>
}
