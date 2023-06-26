import { useState } from "react"
import styles from "./publication.module.css"

type Publication = {
    title : string
    author : string
    year : string
}

export default function Publication({title,author,year} : Publication) {
    return (
        <div className={styles.publication}>
            <p>{title}</p>
            <p className={styles.author}>{`${author} (${year})`}</p>
            <button 
                className={styles.load_button}
                onClick={() => {
                    console.log("load");
                }}
            >
                Load
            </button>
        </div>
    )
}