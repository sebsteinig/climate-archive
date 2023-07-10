import { PropsWithChildren } from "react"

type Props = {
    onClick? : Function
}

export function Variable(props:PropsWithChildren<Props>) {
    
    return (
        <div className="group bg-slate-700 rounded-lg p-2 h-fit w-fit" 
            
            onClick={() => {
                if (props.onClick) {
                    props.onClick()
                }
            }}
        >
            {props.children}
        </div>
    )
}

export function addVariable(variable : string, setVariables : Function){
    return () => {setVariables((prev : string[]) => {
        let index = prev.findIndex((e) => e===variable)
        index == -1 ? prev.push("currents") : prev.splice(index, 1)
        console.log(prev)

        return prev
    })}
}