
export type SearchPublication = {
    title? : string
    journal? : string
    authors_short? : string
    year? : number[]
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
    id?: string
}

export type SelectCollectionParameter = DefaultParameter & {
    ids?: string[]
}