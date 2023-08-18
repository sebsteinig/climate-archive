import HomeIcon from "$/assets/icons/home.svg"
import { useRouter } from "next/navigation"

type Props = {
  className?: string
}

export function HomeButton({ className }: Props) {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        router.push("/")
      }}
      className={`rounded-lg outline-none p-2 shadow-lg shadow-slate-900 w-fit h-fit bg-emerald-500 `}
    >
      <HomeIcon className="w-10 h-10 text-slate-300" />
    </button>
  )
}
