"use client";
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'
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

const Main: React.FC = () => {

  return (
    <>
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
        <World config={config}/>
      </Canvas>
    </>
  )
}

export { Main }