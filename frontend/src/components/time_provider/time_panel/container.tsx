import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import { useClusterStore } from "@/utils/store/cluster.store"
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
        <ButtonSecondary
          onClick={() => {
            console.log("duplicate")
            pauseAll()
            addUnsync(collection_idx, { ...time })
          }}
          className="absolute bottom-0 right-0"
        >
          +
        </ButtonSecondary>
      </div>
    )
  },
)
