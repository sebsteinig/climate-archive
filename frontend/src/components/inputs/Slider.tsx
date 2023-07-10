import { PropsWithChildren } from "react"


type Props = {
    min : string,
    max : string,
    value : string,
    onChange : Function,
    onKeyDown ?: Function,
    name ?: string,
    id ?: string
}

export default function Slider({min, max, value, onChange, onKeyDown, name, id}: Props) {
    return (
        <input className="bg-slate-600 w-full web" 
        onChange={(e) => onChange(e)} onKeyDown={(e) =>onKeyDown ? onKeyDown(e) : {}} 
        min={min} max={max} value={value} id={id} name={name} type="range"></input>
    )
}