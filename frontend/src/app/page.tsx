import styles from "./page.module.css"
import React, { createContext, useState } from "react"
import SearchBar from "@/components/sidebar/searchbar/SearchBar"
import dynamic from "next/dynamic"
import TestImage from "@/components/TestImage"
import { TextureLeaf } from "@/utils/database_provider/database_provider.types"
import UI from "@/components/ui"
import SelectJournal from "@/components/sidebar/searchbar/filters/SelectJournals"

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className="absolute right-0 top-0 m-6">CLIMATE ARCHIVE</h1>
      <UI journals={SelectJournal()} />
    </main>
  )
}
