type Props = {
  className?: string
}

export function FullWidthSeparator({ className }: Props) {
  return <div className={`h-1 bg-emerald-400 w-full rounded-md ${className}`} />
}

export function MdSeparator({ className }: Props) {
  return <div className={`h-1 bg-emerald-400 w-1/3 rounded-md ${className}`} />
}

export function SmSeparator({ className }: Props) {
  return <div className={`h-1 bg-emerald-400 w-1/5 rounded-md ${className}`} />
}

export function LgSeparator({ className }: Props) {
  return <div className={`h-1 bg-emerald-400 w-1/2 rounded-md ${className}`} />
}
