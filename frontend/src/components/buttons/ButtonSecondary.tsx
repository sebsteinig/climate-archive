import { PropsWithChildren } from "react"


type Props = {
    onClick : Function,
    disabled ?: boolean
}

export default function ButtonSecondary({onClick, disabled,children}:PropsWithChildren<Props>) {    
    return (
        <button className={`bg-slate-600 text-slate-300 rounded-lg disabled:opacity-30
        outline-none px-5 py-2 tracking-widest shadow`}
        disabled = {disabled}
        onClick={() => onClick()}>
            {children}
        </button>
    )
}