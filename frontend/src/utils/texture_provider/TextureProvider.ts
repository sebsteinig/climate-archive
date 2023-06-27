'use client'
import { getImageArrayBuffer, select } from "../api/api"
import Texture from "../database/Texture"
import {database} from "@/utils/database/database"



export type TextureInfo = {
    exp_id:string
    variable: string
    path: string

    chunk_time? : {
        current :number
        max : number
    }
    chunk_vertical? : {
        current :number
        max : number
    }
    resolution? : {
        x : number
        y : number
    }
    levels : number
    timesteps : number
    xsize : number
    xfirst : number
    xinc : number
    ysize : number
    yfirst : number
    yinc : number
    //metadata! : Object
    created_at : string
    config_name : string
    extension : string
    lossless : boolean
    nan_value_encoding : number
    threshold : number
}
export type RequestTexture = {
    exp_id:string
    variable?: string[]

    chunk_time? : {
        lower_bound :number
        upper_bound : number
    } | number 
    chunk_vertical? : {
        lower_bound :number
        upper_bound : number
    } | number 

    resolution? : {
        x : number
        y : number
    }
}
export type SearchTexture = {    
    exp_id:string
    variable: string
    path: string
}
export async function load(requested_texture:RequestTexture) {

    const response = await select(requested_texture.exp_id,{
        vars : requested_texture.variable
        /** TODO : chunks */

        /** TODO : resolutions */
    })
    return Promise.all(response.map(async res=>{
        const searched_texture : TextureInfo = {
            exp_id : res.exp_id,
            config_name : res.config_name,
            created_at : res.created_at,
            extension : res.extension,
            levels : res.levels,
            lossless : res.lossless,
            nan_value_encoding : res.nan_value_encoding,
            path : res.paths_mean[0],
            threshold : res.threshold,
            timesteps : res.timesteps,
            variable : res.variable_name,
            xfirst : res.xfirst,
            xinc : res.xinc,
            xsize : res.xsize,
            yfirst : res.yfirst,
            yinc : res.yinc,
            ysize : res.ysize,
            /** TODO : chunks */
    
            /** TODO : resolutions */

        };
        const texture = await database.textures.get({path:searched_texture.path})

        if ( !texture ) { // texture is undefined => not in the db, must be fetched and inserted in db
            console.log(`fetch ${searched_texture.exp_id}:${searched_texture.variable} remotly`);
            
            const image_blob = await getImageArrayBuffer(searched_texture.path)
            
            const texture = {
                ...searched_texture,
            
                image : image_blob,
            
                chunk_time  : {
                    current :searched_texture.chunk_time?.current || 1,
                    max : searched_texture.chunk_time?.max || 1,
                },
                chunk_vertical : {
                    current : searched_texture.chunk_vertical?.current || 1,
                    max : searched_texture.chunk_vertical?.max || 1,
                },
                resolution : {
                    x : searched_texture.resolution?.x || 0,
                    y : searched_texture.resolution?.y || 0,
                }
            }
            database.textures.add(texture)
        }else {
            console.log(`fetch ${searched_texture.exp_id}:${searched_texture.variable} locally`);
            
        }
        return {
            exp_id : searched_texture.exp_id,
            path : searched_texture.path,
            variable : searched_texture.variable,
        } as SearchTexture
    }))
}

export function loadAll() {

}

export async function getImageBase64(searched_texture:SearchTexture) {
    console.log(`loading ${searched_texture.exp_id} : ${searched_texture.variable}`);
    
    const texture = await getTexture(searched_texture)
    const base64 = btoa(
        new Uint8Array(texture.image).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
        )
    )
    console.log(`data loaded for ${texture.exp_id} : ${texture.variable} size = ${base64.length}`);
    
    return base64
}

export async  function getTexture(searched_texture:SearchTexture) {
    const texture = await database.textures.get({path:searched_texture.path})
    return texture!
}

export function putTexture(texture:Texture) {
    return database.textures.add(texture)
}