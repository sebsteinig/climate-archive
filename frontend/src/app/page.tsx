//"use client";
import styles from './page.module.css'
import React from 'react'
import { Main } from '../components/3D_components/Main'
import SearchBar from '@/components/utils/searchbar/SearchBar'



export default function Home() {
  return (
    <main className={styles.main}>
      <Main />
      <SearchBar/>
    </main>
  )
}
