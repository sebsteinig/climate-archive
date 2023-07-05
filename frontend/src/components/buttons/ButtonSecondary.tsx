import { PropsWithChildren } from "react"


type Props = {
    onClick : Function,
}

export default function ButtonSecondary({onClick,children}:PropsWithChildren<Props>) {
    return (
        <button className="bg-slate-600 text-slate-300 rounded-lg outline-none px-5 py-2 uppercase tracking-widest shadow" onClick={() => onClick()}>
            {children}
        </button>
    )
}