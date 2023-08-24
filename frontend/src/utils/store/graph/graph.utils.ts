import { Coordinate, FormattedCoordinates } from "./graph.type"
import { Color } from "three"

export function formatCoordinates({
  lat,
  lon,
}: Coordinate): FormattedCoordinates {
  const lat_direction = lat >= 0 ? "N" : "S"
  const lon_direction = lon >= 0 ? "E" : "W"

  const formatted_latitude = `${Math.abs(lat).toFixed(1)}° ${lat_direction}`
  const formatted_longitude = `${Math.abs(lon).toFixed(1)}° ${lon_direction}`

  return {
    f_lat: formatted_latitude,
    f_lon: formatted_longitude,
  }
}


export function getRandomHexColor(){
  const rgb = new Color()
  rgb.setRGB(Math.random(), Math.random() * 0.8, Math.random() * 0.3)
  return `#${rgb.getHexString()}`
}