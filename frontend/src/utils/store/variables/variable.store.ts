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
  VariableName,
} from "./variable.types"

export type VariableSlice = {
  active_variables: Map<VariableName, boolean>
  activate: (v: VariableName) => void
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
  m.set(VariableName.currents, false)
  m.set(VariableName.clt, false)
  m.set(VariableName.height, false)
  m.set(VariableName.liconc, false)
  m.set(VariableName.mlotst, false)
  m.set(VariableName.pfts, false)
  m.set(VariableName.pr, false)
  m.set(VariableName.sic, false)
  m.set(VariableName.snc, false)
  m.set(VariableName.tas, false)
  m.set(VariableName.tos, false)
  m.set(VariableName.winds, false)
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
    activate: (v: VariableName) =>
      set((state) => {
        state.active_variables.set(v, !state.active_variables.get(v)!)
      }),
    variables: {
      currents: {
        name: VariableName.currents,
        animation_speed: 0.025,
        reference_speed: 50,
        arrows: 1.3,
        arrows_size: 1,
        scale_by_magnitude: true,
        color_by_magnitude: false,
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
        name: VariableName.clt,
      },
      height: {
        name: VariableName.height,
        diplacement: 0.2,
        updateDiplacement: (value: number) =>
          set((state) => {
            state.variables.height.diplacement = value
          }),
      },
      liconc: {
        name: VariableName.liconc,
      },
      mlotst: {
        name: VariableName.mlotst,
      },
      pfts: {
        name: VariableName.pfts,
      },
      pr: {
        name: VariableName.pr,
        min: 3.5,
        max: 12,
        updateMin: (value: number) =>
          set((state) => {
            state.variables.pr.min = value
          }),
        updateMax: (value: number) =>
          set((state) => {
            state.variables.pr.max = value
          }),
      },
      sic: {
        name: VariableName.sic,
      },
      snc: {
        name: VariableName.snc,
      },
      tas: {
        name: VariableName.tas,
      },
      tos: {
        min: -2,
        max: 36,
        anomaly_range: 15,
        anomalies_lower_bound: 2.5,
        sea_ice: true,
        name: VariableName.tos,
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
        name: VariableName.winds,
        animation_speed: 0.025,
        min_speed: 20,
        reference_speed: 35,
        arrows: 10000,
        arrows_size: 2,
        scale_by_magnitude: true,
        color_by_magnitude: true,
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
