"use client"
import { getImageArrayBuffer, select, selectAll } from "../api/api"
import { Texture, TextureInfo } from "../database/database.types"
import { Database } from "@/utils/database/database"
import {
  RequestMultipleTexture,
  RequestTexture,
} from "./database_provider.types"
import { LRUCache } from "lru-cache"
import { VariableName } from "../store/variables/variable.types"
import { SelectSingleResult } from "../api/api.types"
import { Experiment, Experiments, Publication } from "../types"
import { collectionEquals } from "../types.utils"

class TextureNotFound extends Error {
  texture!: TextureInfo
  constructor(searched_texture: TextureInfo) {
    super()
    this.texture = searched_texture
  }
}
class TextureMustBeLoaded extends Error {
  path!: string | TextureInfo | { exp_id: string; variable: VariableName }
  constructor(
    path: string | TextureInfo | { exp_id: string; variable: VariableName },
  ) {
    super()
    this.path = path
  }
}

class DatabaseProvider {
  database!: Database
  cache!: LRUCache<string, Texture>
  info_cache!: LRUCache<{ exp_id: string; variable: VariableName }, TextureInfo>

  constructor() {
    this.database = new Database()
    this.cache = new LRUCache({
      max: 100,
    })
    this.info_cache = new LRUCache({
      max: 100,
    })
  }

  private async _loadPaths(paths: { grid: string[][] }[], info: TextureInfo) {
    await Promise.all(
      paths.flatMap(({ grid }) => {
        return grid.flatMap((row) => {
          return row.map(async (path) => {
            let texture = await this.loadFromDb(path)

            if (!texture) {
              // texture is undefined => not in the db, must be fetched and inserted in db
              texture = await this.loadFromServer(path)
            }
            if (!texture) {
              throw new TextureNotFound(info)
            }
            this.cache.set(path, texture)
          })
        })
      }),
    )
  }

  private async _loadFromSingleResult(res: SelectSingleResult) {
    const info: TextureInfo = {
      ...res,
      variable: res.variable_name,
      /** TODO : resolutions */
    }

    await this._loadPaths(info.paths_ts.paths, info)
    await this._loadPaths(info.paths_mean.paths, info)

    try {
      const is_already = await this.database.textures_info.get([
        info.exp_id,
        info.variable,
      ])
      if (!is_already) {
        this.database.textures_info.add(info)
      }
    } catch (error) {
      console.log("ERROR ----")

      console.log({ info })
    }

    const leaf_ts = {
      paths: info.paths_ts.paths,
    }
    const leaf_mean = {
      paths: info.paths_mean.paths,
    }
    return {
      exp_id: info.exp_id,
      variable: VariableName[info.variable as keyof typeof VariableName],
      mean: leaf_mean,
      ts: leaf_ts,
    }
  }
  async load(requested_texture: RequestTexture) {
    const texture_infos = await this.database.textures_info.where('exp_id').equals(requested_texture.exp_id).toArray()

    if(texture_infos.length === Object.keys(VariableName).length / 2){
      return undefined
    }
    
    const response = await select(requested_texture.exp_id, {
      vars: requested_texture.variables,
      /** TODO : resolutions */
    })
    return Promise.all(
      response.map(async (res) => {
        return this._loadFromSingleResult(res)
      }),
    )
  }

  async loadAll(requested_textures: RequestMultipleTexture) {
    const response = await selectAll({
      vars: requested_textures.variables,
      ids: requested_textures.exp_ids,
      /** TODO : resolutions */
    })
    const res = await Promise.all(
      Object.entries(response).flatMap(async (tmp) => {
        const [_, single_result_arr] = tmp
        const res = await Promise.all(
          single_result_arr.map(async (res) => {
            return this._loadFromSingleResult(res)
          }),
        )

        return res
      }),
    )
    return res
  }

  async loadFromDb(path: string) {
    const texture = await this.database.textures.get({ path: path })
    return texture
  }

  async loadFromServer(path: string) {
    const image_blob = await getImageArrayBuffer(path)

    const texture = {
      path,
      image: image_blob,
    } as Texture
    const is_already = await this.database.textures.get({ path })
    if (!is_already) {
      this.database.textures.add(texture)
    }
    return texture!
  }

  async getImageBase64(path: string) {
    const texture = await this.getTexture(path)
    const base64 = btoa(
      new Uint8Array(texture.image).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    )
    return base64
  }

  async getInfo(exp_id: string, variable: VariableName) {
    let texture_info = this.info_cache.get({ exp_id, variable })
    if (!texture_info) {
      texture_info = await this.database.textures_info.get([
        exp_id,
        VariableName[variable],
      ])
    }
    if (!texture_info) {
      console.log("GET INFO ERROR ")
      console.log({ variable, exp_id })
      throw new TextureMustBeLoaded({ variable, exp_id })
    }
    return texture_info
  }

  async getTexture(path: string) {
    let texture = this.cache.get(path)
    if (!texture) {
      texture = await this.database.textures.get({ path: path })
      this.cache.set(path, texture)
    }
    if (!texture) {
      texture = await this.loadFromServer(path)
    }
    return texture!
  }

  async loadAllColections() {
    const collections = await this.database.collections.toArray()

    return collections
  }

  async addCollectionToDb(collection: Publication | Experiments) {
    const collections_array = await this.database.collections
      .filter((e) => {
        return collectionEquals(collection, e.data)
      })
      .toArray()

    if (!collections_array || collections_array.length === 0) {
      return await this.database.collections.add({ data: collection,date:new Date().toISOString() })
    } else {
      const map_experiments = new Map<string, Experiment>()
      for (let exp of collection.exps) {
        map_experiments.set(exp.id, exp)
      }
      for (let exp of collections_array[0].data.exps) {
        map_experiments.set(exp.id, exp)
      }

      return await this.database.collections
        .filter((e) => {
          return collectionEquals(collection, e.data)
        })
        .modify({ "data.exps": Array.from(map_experiments).map((v) => v[1]) })
    }
  }
}

export const database_provider = new DatabaseProvider()
