
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
    like : string
    with : string
    config_name : string
	extension : string
	lossless : boolean
	nan_value_encoding : number
	threshold : number
	chunks_time : number
	chunks_vertical : number
	rx : number
	ry : number
}