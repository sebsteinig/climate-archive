
import styles from './page.module.css'
import React, { createContext, useState } from 'react'
import SearchBar from '@/components/searchbar/SearchBar'
import TestImage from '@/components/TestImage'
import { TextureLeaf } from '@/utils/texture_provider/texture_provider.types'
//import UI from '@/components/ui'
import SelectJournal from '@/components/searchbar/filters/SelectJournals'

import dynamic from "next/dynamic";

const UI = dynamic(() => import('@/components/ui'), {ssr: false});

export default function Home() {
  return (
    <main className={styles.main}>
      <UI journals={SelectJournal()}/>
    </main>
  )
}

