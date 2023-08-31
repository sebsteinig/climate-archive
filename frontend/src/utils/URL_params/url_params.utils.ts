import { ReadonlyURLSearchParams } from "next/navigation"
import { Slots, TimeFrameRef } from "../store/worlds/time/time.type"
import { isPublication } from "../types.utils"

export type UP_ContainerDesc = {
  authors_short: string
  year: number
  exp_id: string
}

export function getContainers(sp: ReadonlyURLSearchParams) {
  const containers: UP_ContainerDesc[] = []

  for (let [key, value] of sp.entries()) {
    if (key == "reload") continue
    if (!key.includes("*")) throw new Error("Incorrect query parameters")

    const [author, year] = key.split("*")
    let int_year = parseInt(year)
    if (Number.isNaN(int_year)) throw new Error("Incorrect query parameters")
    containers.push({
      authors_short: author.replaceAll(".", " "),
      year: int_year,
      exp_id: value,
    })
  }
  return containers
}

export function upPush(sp: URLSearchParams, c_desc: UP_ContainerDesc) {
  sp.append(
    `${c_desc.authors_short.replaceAll(" ", ".")}*${c_desc.year}`,
    c_desc.exp_id,
  )
}

export function toggleReload(sp: URLSearchParams, reload?: boolean) {
  const r = sp.get("reload")
  if (r) {
    sp.set("reload", (!(r.toLowerCase() === "true")).toString())
  } else {
    sp.set("reload", (!(reload ?? false)).toString())
  }
}

export function resolveURLparams(slots: Slots) {
  const sp = new URLSearchParams()
  for (let [world_id, data] of slots) {
    const publication = data.collection
    if (!isPublication(publication)) continue

    upPush(sp, {
      authors_short: publication.authors_short,
      year: publication.year,
      exp_id: data.exp?.id ?? data.collection.exps[0].id,
    })
  }
  return sp
}
