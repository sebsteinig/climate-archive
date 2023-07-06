import { PropsWithChildren } from "react"


type Props = {
    placeholder : string,
    value : string,
    onChange : Function,
    onKeyDown ?: Function,
    name ?: string,
    id ?: string
}

export default function InputField({placeholder, value, onChange, onKeyDown, name, id}: Props) {
    return (
        <input className="bg-slate-600 border-x-4 border-r-sky-600 border-l-emerald-400 px-5 py-2 placeholder:text-slate-300/80 outline-none" 
        onChange={(e) => onChange(e)} onKeyDown={(e) =>onKeyDown ? onKeyDown(e) : {}} 
        placeholder={placeholder} value={value} id={id} name={name} type="text"></input>
    )
}