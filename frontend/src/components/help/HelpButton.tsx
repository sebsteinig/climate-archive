
import HelpIcon from "$/assets/icons/help.svg"

type Props = {
    className ?: string 
}

export function HelpButton({className}:Props) {
    return (
        <button className={`rounded-lg outline-none p-2 shadow-lg shadow-slate-900 w-fit h-fit bg-slate-700 ${className ?? ''}`} 
            title="Need Help ?">
            <HelpIcon className="w-10 h-10 text-slate-300"/>
        </button>
    )
}