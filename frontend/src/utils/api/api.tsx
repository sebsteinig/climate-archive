import axios from 'axios';

const URL = "http://localhost:3000/"

export async function search(path : string, query : Object) {
    
    const query_param = Object.entries(query).map(bind => {
        const [key,value] = bind
        return `${key}=${JSON.stringify(value)}`
    }).join("&")

    let url = URL + "search/" + path + (query_param && "/?"+query_param)

    try {
        let data = await axios.get(url)
        console.log(data);
    } catch (error) {
        console.error(error);
        
    }
    
}