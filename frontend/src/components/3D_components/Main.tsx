"use client"
import { Canvas } from "@react-three/fiber"
import { Leva } from "leva"
import React, { RefObject } from "react"
import ReactDOM from "react-dom/client"
import { World } from "./World"

type Props = {
  tick: (delta: number) => void
}

export default function Main({ tick }: Props) {
  return (
    <div className="h-screen w-screen absolute top-0 left-0">
      <Leva collapsed={false} oneLineLabels={false} flat={true} />
      <Canvas
        gl={{
          antialias: false,
        }}
        camera={{
          fov: 55,
          near: 0.1,
          far: 100,
          position: [3, 2, 9],
        }}
      >
        <World tick={tick} />
      </Canvas>
    </div>
  )
}
