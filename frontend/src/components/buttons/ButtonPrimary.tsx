import { PropsWithChildren } from "react"


type Props = {
    onClick : Function,
}

export default function ButtonPrimary({onClick,children}:PropsWithChildren<Props>) {
    return (
        <button className="bg-sky-700 text-slate-300 rounded-lg opacity-80 hover:opacity-100
        outline-none px-5 py-2 uppercase tracking-widest shadow" onClick={() => onClick()}>
            {children}
        </button>
    )
}