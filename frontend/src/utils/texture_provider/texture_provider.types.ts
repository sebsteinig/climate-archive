import { VariableName } from "../store/variables/variable.types"


export type TextureInfo = {
    exp_id:string
    variable: string
    
    paths_ts : string[]
    paths_mean : string[]

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
    variables?: string[]

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
    config_name?: string
	extension?: string
	lossless?: boolean
	nan_value_encoding?: number
	threshold?: number
}

export type RequestMultipleTexture = {
    exp_ids:string[]
    variables?: string[]

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
    config_name?: string
	extension?: string
	lossless?: boolean
	nan_value_encoding?: number
	threshold?: number
}

export type TextureLeaf = {    
    exp_id:string
    variable: VariableName
    path: string
}

export type TextureLeaf_C = {
    exp_id:string
    variable: VariableName
    time_chunks : {
        id:number,
        path:string,
    }[]
    vertical_chunk : {
        id:number,
        path:string,
    }[]
}

export type TextureBranch = {
    mean : (TextureLeaf | TextureLeaf_C)[]
    ts : (TextureLeaf | TextureLeaf_C)[]
}

export type TextureTree = Map<string, Map<VariableName, TextureBranch>>