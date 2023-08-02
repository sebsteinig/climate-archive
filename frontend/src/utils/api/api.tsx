import axios from "axios"
import {
  SearchPublication,
  DefaultParameter,
  SelectCollectionParameter,
  SearchExperiment,
  SelectSingleParameter,
  SelectSingleResult,
  SelectCollectionResult,
} from "./api.types"

// const URL_API = "http://localhost:3000/"
const URL_API = "http://51.89.165.226:3000/"
const URL_IMAGE = "http://51.89.165.226:3005/"

/**
 * @param query {'title', 'journal', 'authors_short'}
 * @returns experiments from publication as json
 */
export function searchPublication(query: SearchPublication) {
  let url = new URL("search/publication/", URL_API)
  if (query.title || query.journal || query.authors_short) {
    Object.entries(query).map((bind) => {
      const [key, value] = bind
      if (value) {
        url.searchParams.append(key, JSON.stringify(value))
      }
    })

    return getData(url.href)
  }
}

/**
 * @param query for
 * @returns labels
 */
export function searchLooking(query: { for: string }) {
  let url = new URL("search/looking/", URL_API)
  url.searchParams.append("for", JSON.stringify(query.for))
  return getData(url.href)
}

/**
 * @param query like ...
 * @returns experiments with these characteristics
 */
export function search(query: SearchExperiment) {
  if (
    !Object.values(query).every((value, index, number) => {
      value == null
    })
  ) {
    let url = new URL("search/", URL_API)
    Object.entries(query).map((bind) => {
      const [key, value] = bind
      if (value) {
        url.searchParams.append(key, JSON.stringify(value))
      }
    })
    return getData(url.href)
  }
}

async function getData(url: string) {
  try {
    let data = await axios.get(url)
    return data.data
  } catch (error) {
    return {}
  }
}

export async function selectCollection(query: SelectCollectionParameter) {
  let url = new URL("select/collection/", URL_API)
  Object.entries(query).forEach((bind) => {
    const [key, value] = bind
    if (value) {
      url.searchParams.append(key, JSON.stringify(value))
    }
  })
  return getData(url.href)
}

export async function select(id: string, query: SelectSingleParameter) {
  let url = new URL(`select/${id}/`, URL_API)
  Object.entries(query).forEach((bind) => {
    const [key, value] = bind
    if (value) {
      url.searchParams.append(key, JSON.stringify(value))
    }
  })
  let data = await axios.get(url.href)
  return data.data as SelectSingleResult[]
}
export async function selectAll(query: SelectCollectionParameter) {
  let url = new URL(`select/collection/`, URL_API)
  Object.entries(query).forEach((bind) => {
    const [key, value] = bind
    if (value) {
      url.searchParams.append(key, JSON.stringify(value))
    }
  })
  let data = await axios.get(url.href)
  return data.data as SelectCollectionResult
}

export async function getImage(path: string) {
  let url = URL + path
  try {
    let data = await axios.get(url, {
      responseType: "arraybuffer",
    })

    const base64 = btoa(
      new Uint8Array(data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    )
    return base64
  } catch (error) {
    throw error
  }
}

export async function getImageArrayBuffer(path: string) {
  console.log(path.split('/').slice(7).reduce((acc,e)=>acc+'/'+e,''));
  
  //BRIDGE server
  // let url = new URL(path.split('/').slice(4).reduce((acc,e)=>acc+'/'+e,''), URL_IMAGE)
  let url = new URL(path.split('/').slice(7).reduce((acc,e)=>acc+'/'+e,''), URL_IMAGE)

  // let url = URL_API + path
  try {
    let res = await axios.get(url.href, {
      responseType: "arraybuffer",
    })

    return res.data as ArrayBuffer
  } catch (error) {
    throw error
  }
}

export async function getJournals() {
  //console.log("FECTH JOURNAL <getJournals>")
  let url = new URL("select/journal/", URL_API)
  let data = await axios.get(url.href)
  let journals = data.data.map((e: { journal: string }) => e.journal)
  return journals as string[]
}
