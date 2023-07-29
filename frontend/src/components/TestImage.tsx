"use client"
import { useClusterStore } from "@/utils/store/cluster.store"
import { findInTree } from "@/utils/store/collection.store"
import { VariableName } from "@/utils/store/variables/variable.types"
import { texture_provider } from "@/utils/texture_provider/TextureProvider"
import { TextureLeaf } from "@/utils/texture_provider/texture_provider.types"
import React, { useEffect, useState, useMemo } from "react"

type Props = {}

export default function TestImage({}: Props) {
  const [image_src, setImage] = useState<string>()

  const variables = useClusterStore((state) => state.variables)
  const variable = useMemo(() => {
    return Object.values(variables).find((v) => v.active)
  }, [variables])

  const exps = useClusterStore((state) => state.collections.current)
  const tree = useClusterStore((state) => state.texture_tree)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  useEffect(() => {
    console.log("EFFECT STATE IMAGE")
    if (!exps || !variable) {
      return
    }

    const branch = findInTree(exps.exps[0], variable.name, tree)
    if (branch) {
      const path = branch.mean.paths[0].grid[0][0]

      Promise.all([
        texture_provider.getTexture(path),
        texture_provider.getInfo(exps.exps[0], variable.name),
      ]).then(([t, info]) => {
        if (ctx) {
          console.log({
            x_size: info.xsize,
            y_size: info.ysize,
            levels: info.levels,
            ts: info.timesteps,
          })
          const w = info.xsize * info.timesteps
          const h = info.ysize * info.levels

          const blob = new Blob([t.image], { type: "image/png" })
          const url = URL.createObjectURL(blob)
          // setImage(url)
          createImageBitmap(blob)
            .then((bitmap) => {
              ctx.drawImage(
                bitmap,
                0,
                0,
                info.xsize,
                info.ysize,
                0,
                0,
                info.xsize,
                info.ysize,
              )
              return canvas.toDataURL("image/png")
            })
            .then((frame_url) => {
              setImage(frame_url)
            })
        }
      })
    }
  }, [variables, tree])
  if (!exps || !variable) {
    return null
  }
  return (
    <div>
      <h1>Images :</h1>
      <div className="grid grid-rows-12 grid-flow-col">
        {/* {images.map((image,idx) => <img key={idx} src={`data:image/jpeg;base64,${image.base64}`} />)} */}
        <img src={image_src} />
      </div>
    </div>
  )
}
