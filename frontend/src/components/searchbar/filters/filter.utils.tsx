import Checkbox from "@/components/inputs/Checkbox";
import { PropsWithChildren, useState } from "react";
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"

type SectionProps = {
    title : string
    open ?: boolean
}

export function Section({title,open,children}:PropsWithChildren<SectionProps>) {
    const [is_visible, display] = useState(open ?? false)

    return (
        <div className="flex flex-col gap-5 select-none">
            <div className="flex flex-row gap-5 cursor-pointer" onClick={() => {display((prev) => !prev)}}>
                <h3>{title}</h3>
                {is_visible ? 
                        <ArrowDown className={`w-4 h-4 grow-0 shrink-0 text-emerald-400 self-center`} />
                    :
                        <ArrowUp className={`w-4 h-4 grow-0 shrink-0 text-emerald-400 self-center`} />   
                }
            </div>
            {is_visible ? children : null}
        </div>
    )
}

export function Label({
    children,
    className,
    onClick,
  }: PropsWithChildren<{ className?: string; onClick?: () => void }>) {
    return (
      <>
        <h5
          onClick={() => (onClick ? onClick() : {})}
          className={`shrink-0 grow-0 capitalize truncate whitespace-nowrap ${
            className ?? ""
          }`}
        >
          {children} :
        </h5>
      </>
    )
  }
  
  export function Row({ children }: PropsWithChildren<{}>) {
    return <div className="flex flex-row gap-5 justify-start">{children}</div>
  }
  
  
  type RowWithCheckBoxProps = {
    toggle: () => void
    label: string
    checked: boolean
  }
  
  export function RowWithCheckBox(props: RowWithCheckBoxProps) {
    return (
      <Row>
        <Label>{props.label}</Label>
        <div className="grow-[2]">
          <Checkbox checked={props.checked} onChange={() => props.toggle()} />
        </div>
      </Row>
    )
  }
  
  export function Rows({ children }: PropsWithChildren<{}>) {
    return <div className="flex flex-col gap-5">{children}</div>
  }
  