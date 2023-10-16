import axios from "axios"
import {
  SearchPublication,
  SelectCollectionParameter,
  SelectSingleParameter,
  SelectSingleResult,
  SelectCollectionResult,
} from "./api.types"
import { ExperimentInfo, Publication } from "../types"
import { Graph } from "../store/graph/graph.type"
import { EVarID } from "../store/variables/variable.types"
import useSWR from "swr"
import { ApiError } from "../errors/errors"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"

// const URL_API = "http://localhost:3000/"
// const URL_IMAGE = "http://localhost:3005/"
const URL_API = "http://51.89.165.226:3000/"
// const URL_IMAGE = "http://51.89.165.226:3005/"
const URL_IMAGE = "https://db.climatearchive.org/"

/**
 * function that returns a list of publications from search values
 * @param query : SearchPublication contains search values for title, author...
 * @returns publication list
 */
export async function searchPublication(query: SearchPublication) {
  try {
    let url = new URL("search/publication/", URL_API)
    console.log(query)
    if (query.title || query.journal || query.authors_short) {
      Object.entries(query).map((bind) => {
        const [key, value] = bind
        if (value) {
          url.searchParams.append(key, JSON.stringify(value))
        }

        console.log(url.href)

      })

      let response = await getData<Publication[]>(url.href)
      console.log(response)

      const  exps  = response[0].exps;

      // Fetching additional info for each item in `exps` array
      let allInfo = [];

      await Promise.all(
        exps.map( async (exp) => {
          const info = await database_provider.getInfo(exp.id, 6)
          allInfo.push(info);
        }
      ));

        // Adding the additional info to the response object
        response[0] = {
          ...response[0],
          allInfo
      };
      // // const info = await database_provider.getInfo('texqe', 6)
      console.log(response)
      return response
    }
    return []
  } catch (error) {
    throw new ApiError()
  }
}

/**
 * SWR hook : this function retrieves the journals
 * and also returns error and loading states
 * @returns list of journals: string[], error : Error and loading : boolean
 */
export function useSelectJournal() {
  let url = new URL("select/journal/", URL_API)
  const fetcher = (url: string) =>
    axios
      .get(url)
      .then((res) => res.data.map((e: { journal: string }) => e.journal))
  const { data, error, isLoading } = useSWR<string[], Error>(url.href, fetcher)
  return { data: data, error: error, isLoading: isLoading }
}

/**
 * SWR hook : this function retrieves the experiments
 * and also returns error and loading states
 * @param query like : string
 * @returns list of experiment info : ExperimentInfo[], error : Error and loading : boolean
 */
export function useSearch(like: string) {
  let href = null
  if (like !== "") {
    let url = new URL("search/", URL_API)
    url.searchParams.append("like", JSON.stringify(like))
    href = url.href
  }
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)
  const { data, error, isLoading } = useSWR<ExperimentInfo[], Error>(
    href,
    fetcher,
  )
  return { data: data, error: error, isLoading: isLoading }
}

/**
 * SWR hook : this function retrieves the experiments
 * and also returns error and loading states
 * @param query : SearchPublication
 * @returns list of publications : Publication[], error : Error and loading : boolean
 */
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
 * function that retrieves labels
 * @todo (NEVER USED)
 * @param query for : string
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

/**
 * returns the data from url
 * @param url : string
 * @returns data
 */
async function getData<T>(url: string) {
  console.log(url)
  let data = await axios.get(url)
  return data.data as T
}

/**
 * retrieves one experiment
 * @param id : string experiment id
 * @param query : SelectSingleParameter parameters like extension, config_name...
 * @returns experiment
 */
export async function select(id: string, query: SelectSingleParameter) {
  try {
    let url = new URL(`select/${id}/`, URL_API)
    console.log(url)
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

/**
 * retrieves a collection of experiments
 * @param query : SelectCollectionParameter contains ids (the list of experiment ids)
 * and other default parameters
 * @returns experiments
 */
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

/**
 * retrieves an image
 * @param path : string image path
 * @returns data
 */
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

export async function getImageAsBlob(path: string) {
  let url = new URL(trimRoutes(path, 7), URL_IMAGE);
  try {
    let res = await axios.get(url.href, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    throw new ApiError();
  }
}
/**
 * function that retrieve netCDF data at a location to be displayed
 * @todo (MOCK DATA AT THE MOMENT)
 * @param graph : Graph containing experiments and position infos
 * @param variable : EVarID
 * @returns data for a period of time
 */
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

/**
 * temporary function
 * @returns mock data
 */

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
  //return[5.0, 4.5, 4.0, 3.3, 2.6, 1.9,0.9, 1.4, 2.2, 2.7, 3, 4.8]
  return labels.map((_n: string, i: number) => Math.random() * 25)
}
