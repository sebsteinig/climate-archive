import axios from 'axios';

const URL = "http://localhost:3000/"
const URL_IMAGE = "http://localhost:3060/"

export async function search(path : string, query : Object) {
    
    const query_param = Object.entries(query).map(bind => {
        const [key,value] = bind
        return `${key}=${JSON.stringify(value)}`
    }).join("&")

    let url = URL + "search/" + path + (query_param && "/?"+query_param)

    try {
        let data = await axios.get(url)        
        return data.data
    } catch (error) {
        throw error
    }
}

export async function select(path : string, query : Object) {
    
    const query_param = Object.entries(query).map(bind => {
        const [key,value] = bind
        return `${key}=${JSON.stringify(value)}`
    }).join("&")

    let url = URL + "select/" + path + (query_param && "/?"+query_param)
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