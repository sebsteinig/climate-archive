

export default class Texture {
    id?:number
    exp_id!:string
    variable!:string
    path!: string

    image! : Blob

    chunk_time! : {
        current :number
        max : number
    }
    chunk_vertical! : {
        current :number
        max : number
    }
    resolution? : {
        x : number
        y : number
    }

}