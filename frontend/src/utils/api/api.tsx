import axios from 'axios';
import { log } from 'console';
import {Publication, DefaultParameter} from "./types"

const URL_API = "http://localhost:3000/"
const URL_IMAGE = "http://localhost:3060/"


/**
 * @param query {'title', 'journal', 'authors_short'} 
 * @returns experiments from publication as json
 */
export function searchPublication(query : Publication) {
    if (query.title || query.journal || query.authors_short){
        const query_param = Object.entries(query).map(bind => {
            const [key,value] = bind
            return `${key}=${JSON.stringify(value)}` 
        }).join("&")
    
        let url = URL_API + "search/publication" + (query_param && "/?"+query_param)
        return getData(url)
    }
}


/**
 * @param query for
 * @returns labels
 */
export function searchLooking(query : {for:string}) {
    const query_param = `for=${JSON.stringify(query.for)}`
    let url = URL_API + "search/looking" + (query_param && "/?"+query_param)
    return getData(url)    
}

/**
 * @param query like ...
 * @returns experiments with these characteristics
 */
export function search(query : DefaultParameter) {
    if (!Object.values(query).every((value,index, number) => {value == null}) ){
        let url = new URL(URL_API + "search/")
        const search_param = new URLSearchParams(url.search)
        Object.entries(query).map(bind => {
            const [key,value] = bind
            if (value) {
                search_param.append(key, value.toString())  
            }
        })
        
        //let url = URL + "search/" + (query_param && "/?"+query_param)
        return getData(url.toString())    
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