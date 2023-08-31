import { WorldData } from "../worlds/time/time.type"

export type Coordinate = {
  lat: number
  lon: number
}

export type FormattedCoordinates = {
  f_lat: string
  f_lon: string
}

export type GraphInfo = Coordinate & {
  data: WorldData
  world_id: number
  id_label: { id: string; label: string } | undefined
}

export type Graph = GraphInfo & {
  color: string
}
