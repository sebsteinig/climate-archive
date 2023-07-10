import TimeProvider from "../time_provider/TimeProvider"
import { Variables } from "../variables/variables"

export type TimeBinder = {
    id : number
    time_provider_id : TimeProvider
    planet_ids : number[]
}

export type SpaceBinder = {
    id : number,
    planet_ids : number[]
}

export class ClusterProvider {

    variables! : Variables
    times! : TimeBinder[]
    spaces! : SpaceBinder[]
    planets! : any[]

    addPlanet() {

    }
    removePlanet(idx:number) {

    }
    spaceLink(planet:any,space_id:number) {

    }
    spaceLinkAll(planets:any[],space_id:number) {

    }
    timeLink(planet:any,time_id:number) {

    }
    timeLinkAll(planets:any[],time_id:number) {

    }

    spaceUnlink(planet:any) {

    }
    spaceUnlinkAll(planets:any[]) {

    }
    timeUnlink(planet:any) {

    }
    timeUnlinkAll(planets:any[]) {

    }

}