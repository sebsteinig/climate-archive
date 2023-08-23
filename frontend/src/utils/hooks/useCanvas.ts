import { RefObject, useRef } from "react"
export type CanvasHolder = {
  current: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
  }
  next: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
  }
}

export type CanvasRef = RefObject<CanvasHolder>
export function useCanvas(): CanvasRef {
  const current_canvas = document.createElement("canvas")
  const current_ctx = current_canvas.getContext("2d")
  const next_canvas = document.createElement("canvas")
  const next_ctx = next_canvas.getContext("2d")
  const context = {
    current: {
      canvas: current_canvas,
      ctx: current_ctx,
    },
    next: {
      canvas: next_canvas,
      ctx: next_ctx,
    },
  } as CanvasHolder
  const ref = useRef<CanvasHolder>(context)
  return ref
}
