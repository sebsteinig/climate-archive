import { PropsWithChildren } from "react"


type Props = {
    onClick : Function,
}

export default function ButtonPrimary({onClick,children}:PropsWithChildren<Props>) {
    return (
        <button className="bg-sky-600 text-slate-100 rounded-lg hover:bg-sky-500
        outline-none px-5 py-2 uppercase tracking-widest shadow" onClick={() => onClick()}>
            {children}
        </button>
    )
}