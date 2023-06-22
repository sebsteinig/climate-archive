import axios from 'axios';
import { log } from 'console';
import {Publication, DefaultParameter, SelectCollectionParameter, SearchExperiment} from "./types"

const URL_API = "http://localhost:3000/"
const URL_IMAGE = "http://localhost:3060/"


/**
 * @param query {'title', 'journal', 'authors_short'} 
 * @returns experiments from publication as json
 */
export function searchPublication(query : Publication) {
    let url = new URL("search/publication/", URL_API)
    if (query.title || query.journal || query.authors_short){
        Object.entries(query).map(bind => {
            const [key,value] = bind
            if (value) {
                url.searchParams.append(key, JSON.stringify(value))  
        }})
        
        return getData(url.href)
    }
}


/**
 * @param query for
 * @returns labels
 */
export function searchLooking(query : {for:string}) {
    let url = new URL("search/looking/", URL_API)
    url.searchParams.append("for", JSON.stringify(query.for))
    return getData(url.href)    
}

/**
 * @param query like ...
 * @returns experiments with these characteristics
 */
export function search(query : SearchExperiment) {
    if (!Object.values(query).every((value,index, number) => {value == null}) ){
        let url = new URL( "search/", URL_API)
        Object.entries(query).map(bind => {
            const [key,value] = bind
            if (value) {
                url.searchParams.append(key, JSON.stringify(value))  
            }
        })
        return getData(url.href)    
    }
}

async function getData(url : string){
    try {
        let data = await axios.get(url)
        return data.data
    } catch (error) {
        console.log(error);
        return {};
    }
}

export async function selectCollection(query : SelectCollectionParameter) {
    if (!Object.values(query).every((value,index, number) => {value == null})){
        let url = new URL("select/collection/", URL_API)
        Object.entries(query).map(bind => {
            const [key,value] = bind
            if (value) {
                url.searchParams.append(key, JSON.stringify(value))  
        }})
        return getData(url.href)
    }
}

export async function select(query : DefaultParameter) {
    const query_param = Object.entries(query).map(bind => {
        const [key,value] = bind
        return `${key}=${JSON.stringify(value)}`
    }).join("&")

    let url = URL + "select/" + (query_param && "/?"+query_param)
    try {
        let data = await axios.get(url)        
        return data.data
    } catch (error) {
        throw error
    }
}


export async function getImage(path : string) {

    let url = URL + path;
    try {
        let data = await axios.get(url, {
                    responseType: "arraybuffer"
                    })

        const base64 = btoa(
            new Uint8Array(data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        ) 
        return base64
    } catch (error) {
        throw error
    }
}