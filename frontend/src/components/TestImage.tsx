'use client'
import { useClusterStore } from "@/utils/store/cluster.store"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { SearchTexture } from "@/utils/texture_provider/texture_provider.types"
import React, { useContext, useEffect, useMemo, useState } from "react"


type Props = {
}

type Content = {
    base64 : string,
    variable : string
}

export default function TestImage({}:Props) {
    const [images,setImages] = useState<Content[]>([])


    const variables = useClusterStore(
        (state) => state.variables)
    
    const search_textures = useClusterStore((state) => state.searchTextures)
    console.log({search_textures});
        
    useEffect(
        () => {
            console.log("EFFECT STATE IMAGE");
            const active_variables = Object.entries(variables).filter(([name,slice]) => {
                return slice.active
            }).map(([name,slice]) => name)

            console.log({active_variables});
            const requests = search_textures.filter((st) => active_variables.includes(st.variable)).map(
                async (texture) => {
                    console.log(`loading ${texture.exp_id} : ${texture.variable}`);
                    
                    return {
                        base64: await texture_provider.getImageBase64({
                            path : texture.path,
                            exp_id : texture.exp_id,
                            variable :texture.variable,
                        }),
                        variable : texture.variable
                    }
                }
            )
            Promise.all(requests).then((data) => {
                setImages((prev) => {return [...data]})
            })

        }
    ,[variables,search_textures])
    return (
        <div>
            <h1>Images :</h1>
            <div className="flex flex-wrap">
                {images.map((image,idx) => <img key={idx} src={`data:image/jpeg;base64,${image.base64}`} />)}
            </div>


        </div>
    )
}