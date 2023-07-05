'use client'
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { useEffect, useState } from "react"

export default function TestImage() {
    const [images,setImages] = useState<string[]>([])
    useEffect(
        () => {
            texture_provider.loadAll([{
                exp_id : "texpa1",
                variable :["snc"]
            },{
                exp_id : "texpa1",
                //variable :["snc","tos"]
            }]).then(
                (results) => {
                    results.map(res => {
                        console.log("data is loaded");
                        const requests = res.map((texture) => {
                            console.log(`loading ${texture.exp_id} : ${texture.variable}`);
                            
                            return texture_provider.getImageBase64({
                                path : texture.path,
                                exp_id : texture.exp_id,
                                variable :texture.variable,
                            })})
                        Promise.all(requests).then((data) => {
                            setImages((prev) => {return [...prev,...data]})
                        })
                    })
                }
            )
        }
    ,[])
    return (
        <div>
            <h1>Images :</h1>
            {images.map((image,idx) => <img key={idx} src={`data:image/jpeg;base64,${image}`} />)}


        </div>
    )
}