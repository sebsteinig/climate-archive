
export type Publication = {
    title? : string
    journal? : string
    authors_short? : string
    /*owner_name : string
    owner_email : string
    abstract : string
    brief_desc : string
    authors_full : string
    year : number*/
}

export type DefaultParameter = {
    config_name?: string
	extension?: string
	lossless?: boolean
	nan_value_encoding?: number
	threshold?: number
	chunks_time?: number
	chunks_vertical?: number
	rx?: number
	ry?: number
}
export type SearchExperiment = DefaultParameter & {
    like?: string
    with?: string
}

export type SelectSingleParameter = DefaultParameter & {
    vars?: string[]
}

export type SelectSingleResult = {
    variable_name : string
    paths_ts : string[]
    paths_mean : string[]
    levels : number
    timesteps : number
    xsize : number
    xfirst : number
    xinc : number
    ysize : number
    yfirst : number
    yinc : number
    metadata : Object
    created_at : string
    config_name : string
    extension : string
    lossless : boolean
    nan_value_encoding : number
    chunks_time : number
    chunks_vertical : number
    rx : number
    ry : number
    exp_id : string
    threshold : number
}

export type SelectCollectionParameter = DefaultParameter & {
    ids: string[]
}