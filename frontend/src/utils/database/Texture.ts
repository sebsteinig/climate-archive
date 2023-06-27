

export default class Texture {
    exp_id!:string
    variable!:string
    path!: string

    image! : ArrayBuffer

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
    levels! : number
    timesteps! : number
    xsize! : number
    xfirst! : number
    xinc! : number
    ysize! : number
    yfirst! : number
    yinc! : number
    //metadata! : Object
    created_at! : string
    config_name! : string
    extension! : string
    lossless! : boolean
    nan_value_encoding! : number
    threshold! : number
}