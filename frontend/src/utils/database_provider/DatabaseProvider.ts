"use client"
import { getImageArrayBuffer, getImageAsBlob, select, selectAll } from "../api/api"
import { Texture, TextureInfo } from "../database/database.types"
import { Database } from "@/utils/database/database"
import {
  RequestMultipleTexture,
  RequestTexture,
} from "./database_provider.types"
import { LRUCache } from "lru-cache"
import { ALL_VARIABLES, EVarID } from "../store/variables/variable.types"
import { SelectSingleResult } from "../api/api.types"
import { Experiment, Experiments, Publication } from "../types"
import { collectionEquals } from "../types.utils"
import {
  PathError,
  PublicationError,
  TextureMustBeLoaded,
  TextureNotFound,
} from "../errors/errors"

class DatabaseProvider {
  database!: Database
  cache!: LRUCache<string, Texture>
  info_cache!: LRUCache<{ exp_id: string; variable: EVarID }, TextureInfo>

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
    try {
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
    } catch (error) {
      throw error
    }
  }

  private async _loadFromSingleResult(
    res: SelectSingleResult,
    only_mean?: boolean,
  ) {
    const info: TextureInfo = {
      ...res,
      variable: res.variable_name,
      /** TODO : resolutions */
    }

    console.log('private')

    if (!only_mean) {
      await this._loadPaths(info.paths_ts.paths, info)
    }
    // TODO : REVERT WHEN NIMBUS BUGS IS FIXED
    // await this._loadPaths(info.paths_mean.paths, info)
    await this._loadPaths(
      info.paths_mean.paths.map(({ grid }) => {
        return {
          grid: grid.map((arr) =>
            arr.map((e) => e.replaceAll(".ts.", ".avg.")),
          ),
        }
      }),
      info,
    )

    try {
      const is_already = await this.database.textures_info.get([
        info.exp_id,
        info.variable,
      ])
      if (!is_already) {
        this.database.textures_info.add(info)
      }
    } catch (error) {
      throw error
    }
  }
  async load(requested_texture: RequestTexture, only_mean?: boolean) {
    const texture_infos = await this.database.textures_info
      .where("exp_id")
      .equals(requested_texture.exp_id)
      .toArray()

    if (texture_infos.length === ALL_VARIABLES.length) return

    const response = await select(requested_texture.exp_id, {
      vars: requested_texture.variables,
      /** TODO : resolutions */
    })
    await Promise.all(
      response.map(async (res) => {
        await this._loadFromSingleResult(res, only_mean)
      }),
    )
  }

  async loadAll(
    requested_textures: RequestMultipleTexture,
    only_mean?: boolean,
  ) {
    const response = await selectAll({
      vars: requested_textures.variables,
      ids: requested_textures.exp_ids,
      config_name: requested_textures.config_name,
      extension: requested_textures.extension,
      lossless: requested_textures.lossless,
      rx: requested_textures.resolution?.x,
      ry: requested_textures.resolution?.y,
      /** TODO : nan_value_encoding, chunks, threshold */
    })
    await Promise.all(
      Object.entries(response).flatMap(async (tmp) => {
        const [_, single_result_arr] = tmp
        await Promise.all(
          single_result_arr.map(async (res) => {
            await this._loadFromSingleResult(res, only_mean)
          }),
        )
      }),
    )
  }

  async loadFromDb(path: string) {
    const texture = await this.database.textures.get({ path: path })
    return texture
  }

  async getImageBase64(path: string) {
    const texture = await this.getTexture(path)
    const base64 = btoa(
      new Uint8Array(texture.image).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    )
    console.log('base64')
    return base64
  }

  async loadFromServer(path: string) {
    let texture = await this.database.textures.get({ path })
    if (texture) return texture
    try {
      // const image_blob = await getImageArrayBuffer(path)
      const image_blob = await getImageAsBlob(path)
      texture = {
        path,
        image: image_blob,
      } as Texture
      this.database.textures.add(texture)
    } catch (error) {
      console.warn(error)
      throw error
    }
    return texture!
  }

  async getInfo(exp_id: string, variable: EVarID) {
    let texture_info = this.info_cache.get({ exp_id, variable })
    if (!texture_info) {
      console.log([exp_id, EVarID[variable]])
      try {
        texture_info = await this.database.textures_info.get([exp_id, EVarID[variable]]);
      } catch (err) {
        console.error("Error fetching from database:", err);
      }
      console.log(texture_info)
    }

    if (!texture_info) {
      throw new TextureMustBeLoaded({ variable, exp_id })
    }


    return texture_info
  }

  async getTexture(path: string) {
    if (!path) throw new PathError("undefinied path")
    let texture = this.cache.get(path)
    if (!texture) {
      texture = await this.database.textures.get({ path: path })
      if (!texture) {
        console.log('load from server')
        texture = await this.loadFromServer(path)
      }
      this.cache.set(path, texture)
    }
    return texture!
  }

  async loadAllColections() {
    const collections = await this.database.collections.toArray()
    return collections
  }

  async addPublicationToDb(publication: Publication) {
    try {
      const collections_array = await this.database.collections
        .filter((e) => {
          return collectionEquals(publication, e.data)
        })
        .toArray()

      if (!collections_array || collections_array.length === 0) {
        return await this.database.collections.add({
          data: publication,
          date: new Date().toISOString(),
        })
      } else {
        const map_experiments = new Map<string, Experiment>()
        for (let exp of publication.exps) {
          map_experiments.set(exp.id, exp)
        }
        for (let exp of collections_array[0].data.exps) {
          map_experiments.set(exp.id, exp)
        }

        return await this.database.collections
          .filter((e) => {
            return collectionEquals(publication, e.data)
          })
          .modify({ "data.exps": Array.from(map_experiments).map((v) => v[1]) })
      }
    } catch (error) {
      throw new PublicationError()
    }
  }
}

export const database_provider = new DatabaseProvider()
