import { WorldData } from "../time/time.type";


export type Coordinate = {
    lat : number
    lon : number
}

export type FormattedCoordinates = {
    f_lat: string;
    f_lon: string;
}
  
export type Graph = Coordinate & {
    data : WorldData
}