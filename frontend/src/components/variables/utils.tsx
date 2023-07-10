import { PropsWithChildren } from "react"

type Props = {

}

export function Variable(props:PropsWithChildren<Props>) {
    
    return (
        <>
            {props.children}
        </>
    )
}