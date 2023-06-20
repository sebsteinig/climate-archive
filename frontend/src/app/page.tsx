//"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Leva } from 'leva'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { World } from '../components/World'
import { Main } from '../components/main'



export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello World</h1>
      <Main />

      <h1>End</h1>
    </main>
  )
}
