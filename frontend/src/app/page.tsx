
import styles from './page.module.css'
import React, { createContext, useState } from 'react'
import SearchBar from '@/components/sidebar/searchbar/SearchBar'
import TestImage from '@/components/TestImage'
import { TextureLeaf } from '@/utils/texture_provider/texture_provider.types'
import SelectJournal from '@/components/sidebar/searchbar/filters/SelectJournals'

import dynamic from "next/dynamic";

const UI = dynamic(() => import('@/components/ui'), {ssr: false});

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className='absolute right-0 top-0 m-6'>CLIMATE ARCHIVE</h1>
      <UI journals={SelectJournal()}/>
    </main>
  )
}

