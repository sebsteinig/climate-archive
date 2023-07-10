'use client'
import { getImageArrayBuffer, select, selectAll } from "../api/api"
import Texture from "../database/Texture"
import {Database} from "@/utils/database/database"
import { RequestMultipleTexture, RequestTexture, SearchTexture, TextureInfo } from "./texture_provider.types"
import { LRUCache } from 'lru-cache'

class TextureNotFound extends Error {
    texture!: TextureInfo
    constructor(searched_texture:TextureInfo) {
        super()
        this.texture = searched_texture
    }
}
class TextureMustBeLoaded extends Error {
    texture!: SearchTexture
    constructor(searched_texture:SearchTexture) {
        super()
        this.texture = searched_texture
    }
}

class TextureProvider {

    database! : Database
    cache! : LRUCache<string,Texture>

    constructor() {
        this.database = new Database()
        this.cache = new LRUCache({
            max:100
        })
    }

    async load(requested_texture:RequestTexture) {
    
        const response = await select(requested_texture.exp_id,{
            vars : requested_texture.variables
            /** TODO : chunks */
    
            /** TODO : resolutions */
        })
        return Promise.all(response.map(async res=>{
            const searched_texture : TextureInfo = {
                ...res,
                path : res.paths_mean[0],
                variable : res.variable_name,
                /** TODO : chunks */
        
                /** TODO : resolutions */
    
            };
            let texture = await this.loadFromDb(searched_texture)
    
            if ( !texture ) { // texture is undefined => not in the db, must be fetched and inserted in db
                texture = await this.loadFromServer(searched_texture)
            }
            if (!texture) {
                throw new TextureNotFound(searched_texture)
            }
            this.cache.set(searched_texture.path,texture)
            return {
                exp_id : searched_texture.exp_id,
                path : searched_texture.path,
                variable : searched_texture.variable,
            } as SearchTexture
        }))
    }

    async  loadAll(requested_textures:RequestMultipleTexture) {

        const response = await selectAll({
                    vars : requested_textures.variables,
                    ids : requested_textures.exp_ids
                    /** TODO : chunks */
            
                    /** TODO : resolutions */
            })
        
        const res = await Promise.all(Object.entries(response).flatMap(async tmp=>{
            const [exp_id,single_result_arr] = tmp

            const res = await Promise.all(single_result_arr.map(async res => {
                const searched_texture : TextureInfo = {
                    ...res,
                    path : res.paths_mean[0],
                    variable : res.variable_name,
                    /** TODO : chunks */
            
                    /** TODO : resolutions */
        
                };
                let texture = await this.loadFromDb(searched_texture)
        
                if ( !texture ) { // texture is undefined => not in the db, must be fetched and inserted in db
                    texture = await this.loadFromServer(searched_texture)
                }
                if (!texture) {
                    throw new TextureNotFound(searched_texture)
                }
                this.cache.set(searched_texture.path,texture)
                return {
                    exp_id : searched_texture.exp_id,
                    path : searched_texture.path,
                    variable : searched_texture.variable,
                } as SearchTexture
            }))

            return res
        }))
        return res
        // return Promise.all(requested_textures.map(
        //     (requested_texture) => {
        //         return this.load(requested_texture)
        //     }
        // ))
    }

    async loadFromDb(searched_texture:TextureInfo) {
        const texture = await this.database.textures.get({path:searched_texture.path})
        if (texture) {
            console.log(`fetch ${searched_texture.exp_id}:${searched_texture.variable} locally`);
        }
        return texture
    }
    
    async loadFromServer(searched_texture:TextureInfo) {
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
        this.database.textures.add(texture)
        return texture!
    }

    async getImageBase64(searched_texture:SearchTexture) {
        console.log(`loading ${searched_texture.exp_id} : ${searched_texture.variable}`);

        const texture = await this.getTexture(searched_texture)
        const base64 = btoa(
            new Uint8Array(texture.image).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        )
        console.log(`data loaded for ${texture.exp_id} : ${texture.variable} size = ${base64.length}`);
        
        return base64
    }
    
    async getTexture(searched_texture:SearchTexture) {
        let texture = this.cache.get(searched_texture.path)
        if (!texture) {
            texture = await this.database.textures.get({path:searched_texture.path})
            this.cache.set(searched_texture.path,texture)
        }else {
            console.log(`data loaded from lru cache`);
            
        }
        if (!texture) {
            throw new TextureMustBeLoaded(searched_texture)
        }
        return texture!
    }
}



export const texture_provider = new TextureProvider()