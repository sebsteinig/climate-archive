type ErrorProps = {
  error: boolean
  message?: string
}

export function ErrorBox({ error, message }: ErrorProps) {
  if (!error) return null
  return (
    <div className="w-full my-5 p-5 small-caps tracking-widest bg-red-500 rounded-md text-slate-300">
      {message ?? "Oops! Something went wrong"}
    </div>
  )
}
