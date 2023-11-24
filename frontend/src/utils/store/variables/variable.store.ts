import { StateCreator } from "zustand"
import {
  CurrentsSlice,
  CltSlice,
  HeightSlice,
  LiconcSlice,
  MlotstSlice,
  PftsSlice,
  PrSlice,
  SicSlice,
  SncSlice,
  TasSlice,
  TosSlice,
  WindsSlice,
  EVarID,
} from "./variable.types"
import colormaps_list from "$/assets/colormaps/colormaps_list.json"


export type VariableSlice = {
  active_variables: Map<EVarID, boolean>
  activate: (v: EVarID) => void
  variables: {
    currents: CurrentsSlice
    clt: CltSlice
    height: HeightSlice
    liconc: LiconcSlice
    mlotst: MlotstSlice
    pfts: PftsSlice
    pr: PrSlice
    sic: SicSlice
    snc: SncSlice
    tas: TasSlice
    tos: TosSlice
    winds: WindsSlice
  }
}

function initMap() {
  let m = new Map()
  m.set(EVarID.currents, false)
  m.set(EVarID.clt, false)
  m.set(EVarID.height, true)
  m.set(EVarID.liconc, false)
  m.set(EVarID.mlotst, false)
  m.set(EVarID.pfts, false)
  m.set(EVarID.pr, false)
  m.set(EVarID.sic, false)
  m.set(EVarID.snc, false)
  m.set(EVarID.tas, false)
  m.set(EVarID.tos, false)
  m.set(EVarID.winds, false)
  return m
}

export const createVariableSlice: StateCreator<
  VariableSlice,
  [["zustand/immer", never]],
  [],
  VariableSlice
> = (set) => {
  return {
    active_variables: initMap(),
    activate: (v: EVarID) =>
      set((state) => {
        state.active_variables.set(v, !state.active_variables.get(v)!)
      }),
    variables: {
      currents: {
        name: EVarID.currents,
        animation_speed: 0.025,
        reference_speed: 50,
        arrows: 1.3,
        arrows_size: 1,
        scale_by_magnitude: true,
        color_by_magnitude: false,
        colormap: "ipccPrecip.png",
        updateColormap: (value: string) =>
          set((state) => {
            state.variables.currents.colormap = value
          }),
        updateAnimationSpeed: (value: number) =>
          set((state) => {
            state.variables.currents.animation_speed = value
          }),
        updateReferenceSpeed: (value: number) =>
          set((state) => {
            state.variables.currents.reference_speed = value
          }),
        updateArrows: (value: number) =>
          set((state) => {
            state.variables.currents.arrows = value
          }),
        updateArrowsSize: (value: number) =>
          set((state) => {
            state.variables.currents.arrows_size = value
          }),
        toggleScaleByMagnitude: () =>
          set((state) => {
            state.variables.currents.scale_by_magnitude =
              !state.variables.currents.scale_by_magnitude
          }),
        toggleColorByMagnitude: () =>
          set((state) => {
            state.variables.currents.color_by_magnitude =
              !state.variables.currents.color_by_magnitude
          }),
      },
      clt: {
        name: EVarID.clt,
      },
      height: {
        name: EVarID.height,
        diplacement: 0.2,
        min: -6000,
        max: 6000,
        colormap: "topo.png",
        colormap_index: colormaps_list.indexOf("topo.png"),
        updateColormap: (name: string, index: number) => {
          set((state) => ({
            variables: {
              ...state.variables,
              height: {
                ...state.variables.height,
                colormap: name,
                colormap_index: index,
              },
            },
          }));
        },
        updateMin: (value: number) =>
          set((state) => {
            state.variables.height.min = value
          }),
        updateMax: (value: number) =>
          set((state) => {
            state.variables.height.max = value
          }),
        updateDiplacement: (value: number) =>
          set((state) => {
            state.variables.height.diplacement = value
          }),
      },
      liconc: {
        name: EVarID.liconc,
      },
      mlotst: {
        name: EVarID.mlotst,
      },
      pfts: {
        name: EVarID.pfts,
      },
      pr: {
        name: EVarID.pr,
        min: 3.5,
        max: 12,
        anomaly_range: 5,
        colormap: "rain.png",
        colormap_index: colormaps_list.indexOf("rain.png"),
        updateColormap: (name: string, index: number) => {
          set((state) => ({
            variables: {
              ...state.variables,
              pr: {
                ...state.variables.pr,
                colormap: name,
                colormap_index: index,
              },
            },
          }));
        },
        updateMin: (value: number) =>
          set((state) => {
            state.variables.pr.min = value
          }),
        updateMax: (value: number) =>
          set((state) => {
            state.variables.pr.max = value
          }),
        updateAnomalyRange: (value: number) =>
        set((state) => {
          state.variables.pr.anomaly_range = value
        }),
      },
      sic: {
        name: EVarID.sic,
      },
      snc: {
        name: EVarID.snc,
      },
      tas: {
        name: EVarID.tas,
      },
      tos: {
        min: -2,
        max: 36,
        anomaly_range: 15,
        anomalies_lower_bound: 2.5,
        sea_ice: true,
        name: EVarID.tos,
        colormap: "ipccPrecip.png",
        updateColormap: (value: string) =>
          set((state) => {
            state.variables.tos.colormap = value
          }),
        updateMin: (value: number) =>
          set((state) => {
            state.variables.tos.min = value
          }),
        updateMax: (value: number) =>
          set((state) => {
            state.variables.tos.max = value
          }),
        updateAnomalyRange: (value: number) =>
          set((state) => {
            state.variables.tos.anomaly_range = value
          }),
        updateAnomaliesLowerBound: (value: number) =>
          set((state) => {
            state.variables.tos.anomalies_lower_bound = value
          }),
        toggleSeaIce: () =>
          set((state) => {
            state.variables.tos.sea_ice = !state.variables.tos.sea_ice
          }),
      },
      winds: {
        name: EVarID.winds,
        animation_speed: 0.025,
        min_speed: 20,
        reference_speed: 35,
        arrows: 10000,
        arrows_size: 2,
        scale_by_magnitude: true,
        color_by_magnitude: true,
        colormap: "ipccPrecip.png",
        updateColormap: (value: string) =>
          set((state) => {
            state.variables.winds.colormap = value
          }),
        updateAnimationSpeed: (value: number) =>
          set((state) => {
            state.variables.winds.animation_speed = value
          }),
        updateMinSpeed: (value: number) =>
          set((state) => {
            state.variables.winds.min_speed = value
          }),
        updateReferenceSpeed: (value: number) =>
          set((state) => {
            state.variables.winds.reference_speed = value
          }),
        updateArrows: (value: number) =>
          set((state) => {
            state.variables.winds.arrows = value
          }),
        updateArrowsSize: (value: number) =>
          set((state) => {
            state.variables.winds.arrows_size = value
          }),
        toggleScaleByMagnitude: () =>
          set((state) => {
            state.variables.winds.scale_by_magnitude =
              !state.variables.winds.scale_by_magnitude
          }),
        toggleColorByMagnitude: () =>
          set((state) => {
            state.variables.winds.color_by_magnitude =
              !state.variables.winds.color_by_magnitude
          }),
      },
    },
  }
}
