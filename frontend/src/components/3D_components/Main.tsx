"use client";
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { RefObject } from 'react'
import ReactDOM from 'react-dom/client'
import { World } from './World'

type modelDesciptor = {
  model: string,
  heightData: string
}

var config: modelDesciptor = {
  model: "Dune",
  heightData: "/assets/textures/tfgzk_height.smoothed.png"
}

type Props = {
  tick : (delta:number) => void
}

export default function Main({tick}:Props) {

  return (
    <div className='h-screen w-screen absolute top-0 left-0'>
      <Leva
        collapsed={false}
        oneLineLabels={false}
        flat={true}
      />
      <Canvas
        camera={{
          fov: 55,
          near: 0.1,
          far: 200,
          position: [3, 2, 9],
        }}
        shadows
      >
        <World config={config} tick={tick}/>
      </Canvas>
    </div>
  )
}
