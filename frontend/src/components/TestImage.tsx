'use client'
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { SearchTexture } from "@/utils/texture_provider/texture_provider.types"
import React, { useContext, useEffect, useState } from "react"


type Props = {
    context : React.Context<SearchTexture[]>
}

export default function TestImage({context}:Props) {
    const [images,setImages] = useState<string[]>([])
    const states = useContext(context)
    useEffect(
        () => {
            console.log("EFFECT STATE IMAGE");
            
            const requests = states.map(async (texture) => {
                console.log(`loading ${texture.exp_id} : ${texture.variable}`);
                
                return texture_provider.getImageBase64({
                    path : texture.path,
                    exp_id : texture.exp_id,
                    variable :texture.variable,
                })})
            Promise.all(requests).then((data) => {
                setImages((prev) => {return [...prev,...data]})
            })

        }
    ,[states])
    return (
        <div>
            <h1>Images :</h1>
            <div className="flex flex-wrap">
                {images.map((image,idx) => <img key={idx} src={`data:image/jpeg;base64,${image}`} />)}
            </div>


        </div>
    )
}