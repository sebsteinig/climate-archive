
import styles from './page.module.css'
import React, { createContext, useState } from 'react'
import SearchBar from '@/components/searchbar/SearchBar'
import dynamic from 'next/dynamic'
import TestImage from '@/components/TestImage'
import { TextureLeaf } from '@/utils/texture_provider/texture_provider.types'
import UI from '@/components/ui'
import SelectJournal from '@/components/searchbar/filters/SelectJournals'


const Main = dynamic(() => import('@/components/3D_components/Main'))


export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Main /> */}
      <UI journals={SelectJournal()}/>
      {/* <TestImage /> */}
    </main>
  )
}

