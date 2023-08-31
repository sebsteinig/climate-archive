import { PropsWithChildren } from "react"

export function Label({
  children,
  className,
  onClick,
}: PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <>
      <h5
        onClick={() => (onClick ? onClick() : {})}
        className={`flex-grow capitalize truncate whitespace-nowrap ${
          className ?? ""
        }`}
      >
        {children}
      </h5>
      <h5>:</h5>
    </>
  )
}
