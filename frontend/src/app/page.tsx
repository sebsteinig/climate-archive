//"use client";
import styles from './page.module.css'
import React from 'react'
//import { Main } from '../components/3D_components/Main'
import SearchBar from '@/components/searchbar/SearchBar'
import dynamic from 'next/dynamic'


const Main = dynamic(() => import('@/components/3D_components/Main'))

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Main /> */}
      <SearchBar/>
    </main>
  )
}
