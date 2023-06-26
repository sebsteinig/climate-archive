import Texture from "../database/Texture";
import { db } from "../database/database";



export default class Cache {


    async getTexture(path:string) {
        const texture = await db.textures.get({path})
        if ( !texture ) { // texture is undefined => not in the db, must be fetched and inserted in db
            
        } else {
            return texture!
        }
    }

    putTexture(texture:Texture) {

    }
}