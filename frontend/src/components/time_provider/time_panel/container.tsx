import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { useClusterStore } from "@/utils/store/cluster.store"
import Image from "next/image"
import DuplicateIcon from "$/assets/icons/duplicate-slate-500.svg"
import ArrowUpIcon from "$/assets/icons/arrow-up-emerald-400.svg"
import { PropsWithChildren, forwardRef } from "react"

type Props = {
  className?: string
  time_idx: number
  collection_idx: number
}

export const Container = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  function Container({ time_idx, collection_idx, className, children }, ref) {
    const pauseAll = useClusterStore((state) => state.time.pauseAll)
    const addUnsync = useClusterStore((state) => state.time.addUnSync)
    const time = useClusterStore((state) => state.time.slots.map.get(time_idx))

    return (
      <div className={`relative w-full h-full ${className ?? ""}`} ref={ref}>
        {children}
        <div className={`absolute group bottom-0 right-0 bg-gray-900 cursor-pointer
         rounded-full p-2 m-2`}
        >
          <div className="w-10 h-10 px-2">
            <ArrowUpIcon style={{color: "#64748b"}}/>
          </div>

          <div className="w-10 h-10 p-2" onClick={() => {
              console.log("duplicate")
              pauseAll()
              addUnsync(collection_idx, { ...time })
            }}>
          <DuplicateIcon style={{color: "#64748b"}} />
          </div>
          
          {/* <Image
            src={DuplicateIcon}
            priority
            alt="duplicate"
            className="hidden group-hover:block w-10 h-10 px-2"
          />
          <Image
            src={DuplicateIcon}
            priority
            alt="duplicate"
            className="w-10 h-10 px-2"
          /> */}
        
        </div>
        
      </div>
    )
  },
)
