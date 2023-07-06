import { PropsWithChildren } from "react"


type Props = {
    value?: string,
    defaultValue?: string[],
    onChange: Function,
    name ?: string,
    id ?: string
}

export default function MultiSelect({onChange, name, id, defaultValue, children}:PropsWithChildren<Props>) {
    return (
        <select 
        onChange={(e) => onChange(e)} defaultValue = {defaultValue} id={id} name={name} multiple>
            {children}
        </select>
    )
}