import { PropsWithChildren } from "react"


type Props = {
    value?: string,
    defaultValue?: string,
    onChange: Function,
    name ?: string,
    id ?: string,
    title ?: string
}

export default function Select({onChange, name, id, title, defaultValue, children}:PropsWithChildren<Props>) {
    return (
        <select className="bg-slate-600  px-5 py-2 border-r-slate-500 w-full
        border-l-slate-500 border-x-4 placeholder:text-slate-300/80 outline-none" 
        onChange={(e) => onChange(e)} title = {title} defaultValue = {defaultValue} id={id} name={name}>
            {children}
        </select>
    )
}