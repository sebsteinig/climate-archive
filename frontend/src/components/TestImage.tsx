'use client'
import { getImageBase64, load } from "@/utils/texture_provider/TextureProvider"
import { useEffect, useState } from "react"

export default function TestImage() {
    const [images,setImages] = useState<string[]>([])
    useEffect(
        () => {
            load({
                exp_id : "texpa1",
                variable :["snc"]
            }).then(
                (res) => {

                    console.log("data is loaded");
                    const requests = res.map((texture) => {
                        console.log(`loading ${texture.exp_id} : ${texture.variable}`);
                        
                        return getImageBase64({
                            path : texture.path,
                            exp_id : texture.exp_id,
                            variable :texture.variable,
                        })})
                    Promise.all(requests).then((data) => {
                        console.log(data);
                        
                        setImages(data)
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