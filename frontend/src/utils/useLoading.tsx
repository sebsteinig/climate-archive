import {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

type LoadingProps = {
  fallback: React.ReactNode
  default_state?: boolean
}

type LoadingRef = {
  start: () => void
  finish: () => void
}

export function useLoading() {
  return useRef<LoadingRef>(null)
}

export const Loading = forwardRef<LoadingRef, PropsWithChildren<LoadingProps>>(
  function Loading(props, ref) {
    const [is_loading, showLoading] = useState<boolean>(
      props.default_state ?? false,
    )
    useImperativeHandle(ref, () => {
      return {
        start() {
          showLoading(true)
        },
        finish() {
          showLoading(false)
        },
      }
    })
    if (is_loading) return props.fallback
    return props.children ?? null
  },
)
