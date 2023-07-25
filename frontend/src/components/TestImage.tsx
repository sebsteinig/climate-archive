'use client'
import { useClusterStore } from "@/utils/store/cluster.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { TextureLeaf } from "@/utils/database_provider/texture_provider.types"
import React, { useEffect, useState } from "react"


type Props = {
}

type Content = {
    base64 : string,
    variable : VariableName
}

export default function TestImage({}:Props) {
    const [images,setImages] = useState<Content[]>([])


    const variables = useClusterStore(
        (state) => state.variables)
    
    const [texture_tree, current] = useClusterStore((state) => [state.texture_tree, state.current])
    
    useEffect(
        () => {
            console.log("EFFECT STATE IMAGE");
            const active_variables = Object.entries(variables).filter(([name,slice]) => {
                return slice.active
            }).map(([name,slice]) => slice.name)

            console.log({active_variables});
            if (current) {

                const exp = texture_tree.root.get(current)                
                if (exp) {
                    
                    const tmp = active_variables.map((name) => exp.get(name)).filter((e)=>e).flat() as TextureLeaf[]
                    
                    const requests = tmp.map(
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
    
            }
            

        }
    ,[variables,texture_tree])
    return (
        <div>
            <h1>Images :</h1>
            <div className="grid grid-rows-12 grid-flow-col">
                {images.map((image,idx) => <img key={idx} src={`data:image/jpeg;base64,${image.base64}`} />)}
            </div>


        </div>
    )
}