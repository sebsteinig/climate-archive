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
import { ExperimentInfo, Publication } from "../types"
import { Graph } from "../store/graph/graph.type"
import { EVarID } from "../store/variables/variable.types"
import useSWR from "swr"
import { ApiError } from "../errors/errors"

// const URL_API = "http://localhost:3000/"
// const URL_IMAGE = "http://localhost:3005/"
const URL_API = "http://51.89.165.226:3000/"
const URL_IMAGE = "http://51.89.165.226:3005/"

/**
 * @param query {'title', 'journal', 'authors_short'}
 * @returns experiments from publication as json
 */
export async function searchPublication(query: SearchPublication) {
  try {
    let url = new URL("search/publication/", URL_API)
    if (query.title || query.journal || query.authors_short) {
      Object.entries(query).map((bind) => {
        const [key, value] = bind
        if (value) {
          url.searchParams.append(key, JSON.stringify(value))
        }
      })

      return await getData<Publication[]>(url.href)
    }
    return []
  } catch (error) {
    throw new ApiError()
  }
}

export function useSelectJournal(){
  let url = new URL("select/journal/", URL_API)
  const fetcher = (url: string) => axios.get(url).then((res) =>
    res.data.map(
    (e: { journal: string }) => e.journal)
  )
  const { data, error, isLoading } = useSWR<string[], Error>(url.href, fetcher)
  return { data: data, error: error, isLoading: isLoading }
}

export function useSearch(like : string){
  let href = null
  if (like !== ""){
    let url = new URL("search/", URL_API) 
    url.searchParams.append("like", JSON.stringify(like))
    href = url.href
  }    
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)
  const { data, error, isLoading } = useSWR<ExperimentInfo[], Error>(href, fetcher)
  return { data: data, error: error, isLoading: isLoading }
}


export function useSearchPublication(query: SearchPublication) {
  let href = null
  if (query.title || query.journal || query.authors_short) {
    let url = new URL("search/publication/", URL_API)
    Object.entries(query).map((bind) => {
      const [key, value] = bind
      if (value) {
        url.searchParams.append(key, JSON.stringify(value))
      }
    })
    href = url.href
  }
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)
 return useSWR<Publication[], Error>(href, fetcher)
}

/**
 * @param query for
 * @returns labels
 */
export function searchLooking(query: { for: string }) {
  try {
    let url = new URL("search/looking/", URL_API)
    url.searchParams.append("for", JSON.stringify(query.for))
    return getData(url.href)
  } catch (error) {
    throw new ApiError()
  }
}


async function getData<T>(url: string) {
  let data = await axios.get(url)
  return data.data as T
}

export async function select(id: string, query: SelectSingleParameter) {
  try {
    let url = new URL(`select/${id}/`, URL_API)
    Object.entries(query).forEach((bind) => {
      const [key, value] = bind
      if (value) {
        url.searchParams.append(key, JSON.stringify(value))
      }
    })
    let data = await axios.get(url.href)
    return data.data as SelectSingleResult[]
  } catch (error) {
    throw new ApiError()
  }
}
export async function selectAll(query: SelectCollectionParameter) {
  try {
    let url = new URL(`select/collection/`, URL_API)
    Object.entries(query).forEach((bind) => {
      const [key, value] = bind
      if (value) {
        url.searchParams.append(key, JSON.stringify(value))
      }
    })
    let data = await axios.get(url.href)
    return data.data as SelectCollectionResult
  } catch (error) {
    throw new ApiError()
  }
}

function trimRoutes(path: string, nb_of_sub_route: number): string {
  return path
    .split("/")
    .slice(nb_of_sub_route)
    .reduce((acc, route) => `${acc}/${route}`, "")
}

export async function getImageArrayBuffer(path: string) {
  let url = new URL(trimRoutes(path, 7), URL_IMAGE)
  try {
    let res = await axios.get(url.href, {
      responseType: "arraybuffer",
    })

    return res.data as ArrayBuffer
  } catch (error) {
    throw new ApiError()
  }
}

export async function getChartData(graph: Graph, variable: EVarID) {
  //let url = new URL("")
  //let data = await axios.get(url.href)
  try {
    let data = mockData()
    return data
  } catch (error) {
    throw new ApiError()
  }
}

function mockData() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return[5.0, 4.5, 4.0, 3.3, 2.6, 1.9,0.9, 1.4, 2.2, 2.7, 3, 4.8]
  //return labels.map((_n: string, i: number) => Math.random() * 25)
}
