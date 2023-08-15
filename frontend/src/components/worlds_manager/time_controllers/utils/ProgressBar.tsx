import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"
import gsap from "gsap"

export interface ProgessBarRef {
  update: (value: number) => void
}

type ProgressBarProps = {}

export const ProgressBar = forwardRef<ProgessBarRef, ProgressBarProps>(
  function ProgressBar({}, ref) {
    const bar_ref = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => {
      return {
        update(value) {
          if (!bar_ref.current) return

          const clamp_value = Math.max(0, Math.min(value, 1))
          if (clamp_value === 0) {
            bar_ref.current.style.transform = "translateX(-100%)"
          } else {
            gsap.to(bar_ref.current, {
              x: `${(clamp_value - 1) * 100}%`,
              ease: "none",
            })
          }
        },
      }
    })

    return (
      <div className="w-full h-2 rounded-lg bg-slate-900 overflow-hidden relative">
        <div
          ref={bar_ref}
          className="w-full h-full rounded-lg bg-emerald-600 absolute transform origin-left translate-x-[-100%]"
        ></div>
      </div>
    )
  },
)
