import { TextureInfo } from "../database/database.types";
import { EVarID } from "../store/variables/variable.types";

export class TextureNotFound extends Error {
    texture!: TextureInfo
    constructor(searched_texture: TextureInfo) {
      super()
      this.texture = searched_texture
    }
  }
export class TextureMustBeLoaded extends Error {
    path!: string | TextureInfo | { exp_id: string; variable: EVarID }
    constructor(
      path: string | TextureInfo | { exp_id: string; variable: EVarID },
    ) {
      super()
      this.path = path
    }
}

export class ApiError extends Error {
    constructor(message?:string) {
        super(message ?? "Something went wrong")
    }
}

export class PathError extends Error {
    constructor(message?:string) {
        super(message ?? "Something went wrong")
    }
}
export class PublicationError extends Error {
    constructor(message?:string) {
        super(message ?? "Something went wrong")
    }
}