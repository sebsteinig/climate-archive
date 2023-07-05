

export type TextureInfo = {
    exp_id:string
    variable: string
    path: string

    chunk_time? : {
        current :number
        max : number
    }
    chunk_vertical? : {
        current :number
        max : number
    }
    resolution? : {
        x : number
        y : number
    }
    levels : number
    timesteps : number
    xsize : number
    xfirst : number
    xinc : number
    ysize : number
    yfirst : number
    yinc : number
    //metadata! : Object
    created_at : string
    config_name : string
    extension : string
    lossless : boolean
    nan_value_encoding : number
    threshold : number
}
export type RequestTexture = {
    exp_id:string
    variable?: string[]

    chunk_time? : {
        lower_bound :number
        upper_bound : number
    } | number 
    chunk_vertical? : {
        lower_bound :number
        upper_bound : number
    } | number 

    resolution? : {
        x : number
        y : number
    }
}
export type SearchTexture = {    
    exp_id:string
    variable: string
    path: string
}