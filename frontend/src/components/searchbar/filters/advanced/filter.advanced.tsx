import { Section } from "../filter.utils"
import { useStore } from "@/utils/store/store"
import { ExperimentFilters } from "@/utils/store/search/search.store"
import { SelectExperiment, SelectedExperiments } from "./parameters/experiments"
import { SelectResolution } from "./parameters/resolution"
import { SelectVariable } from "./parameters/variables"
import { SelectExtension } from "./parameters/extension"
import { InputConfiguration } from "./parameters/configuration"
import { CheckLossless } from "./parameters/lossless"

export default function FilterAdvanced() {
  const filters = useStore((state) => state.search.filter.experiment)

  return (
    <Section title="Advanced filters">
      <SelectedExperiments />
      <SelectExperiment />
      <SelectVariable />
      <SelectExtension />
      <InputConfiguration />
      <CheckLossless />
      <SelectResolution />

      {filters.exp_ids && filters.exp_ids.length > 0 ? (
        <a href={buildHref(filters)}>
          <div className="bg-slate-600 text-slate-300 rounded-lg outline-none px-5 py-2 tracking-widest shadow w-fit">
            Load
          </div>
        </a>
      ) : null}
    </Section>
  )
}

function buildKeyValue<T>(key: string, value: T | null) {
  if (value) {
    return `${key}=${value}`
  }
  return ""
}

function join(...args: string[]) {
  return args.filter((e) => e).join("&")
}

function buildHref(filters: ExperimentFilters) {
  const exp_ids = buildKeyValue("exp_ids", filters.exp_ids)
  const variables = buildKeyValue("variables", filters.variables)
  const config = buildKeyValue("config_name", filters.config)
  const extension = buildKeyValue("extension", filters.extension)
  const lossless = buildKeyValue("lossless", filters.lossless)
  const resolution = buildKeyValue(
    "resolution",
    filters.resolution !== null
      ? `${filters.resolution.x}*${filters.resolution.y}`
      : null,
  )
  return `/experiments/?${join(
    exp_ids,
    variables,
    config,
    extension,
    lossless,
    resolution,
  )}`
}
