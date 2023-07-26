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

export const createVariableSlice: StateCreator<
  VariableSlice,
  [["zustand/immer", never]],
  [],
  VariableSlice
> = (set) => {
  return {
    variables: {
      currents: {
        active: false,
        name: VariableName.currents,
        animation_speed: 0.025,
        reference_speed: 50,
        arrows: 1.3,
        arrows_size: 1,
        scale_by_magnitude: true,
        color_by_magnitude: false,
        toggle: () =>
          set((state) => {
            state.variables.currents.active = !state.variables.currents.active
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
        active: false,
        name: VariableName.clt,
        toggle: () =>
          set((state) => {
            state.variables.clt.active = !state.variables.clt.active
          }),
      },
      height: {
        active: false,
        name: VariableName.height,
        diplacement: 0.2,
        toggle: () =>
          set((state) => {
            state.variables.height.active = !state.variables.height.active
          }),
        updateDiplacement: (value: number) =>
          set((state) => {
            state.variables.height.diplacement = value
          }),
      },
      liconc: {
        active: false,
        name: VariableName.liconc,
        toggle: () =>
          set((state) => {
            state.variables.liconc.active = !state.variables.liconc.active
          }),
      },
      mlotst: {
        active: false,
        name: VariableName.mlotst,
        toggle: () =>
          set((state) => {
            state.variables.mlotst.active = !state.variables.mlotst.active
          }),
      },
      pfts: {
        active: false,
        name: VariableName.pfts,
        toggle: () =>
          set((state) => {
            state.variables.pfts.active = !state.variables.pfts.active
          }),
      },
      pr: {
        active: false,
        name: VariableName.pr,
        min: 3.5,
        max: 12,
        toggle: () =>
          set((state) => {
            state.variables.pr.active = !state.variables.pr.active
          }),
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
        active: false,
        name: VariableName.sic,
        toggle: () =>
          set((state) => {
            state.variables.sic.active = !state.variables.sic.active
          }),
      },
      snc: {
        active: false,
        name: VariableName.snc,
        toggle: () =>
          set((state) => {
            state.variables.snc.active = !state.variables.snc.active
          }),
      },
      tas: {
        active: false,
        name: VariableName.tas,
        toggle: () =>
          set((state) => {
            state.variables.tas.active = !state.variables.tas.active
          }),
      },
      tos: {
        active: false,
        min: -2,
        max: 36,
        anomaly_range: 15,
        anomalies_lower_bound: 2.5,
        sea_ice: true,
        name: VariableName.tos,
        toggle: () =>
          set((state) => {
            state.variables.tos.active = !state.variables.tos.active
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
        active: false,
        name: VariableName.winds,
        animation_speed: 0.025,
        min_speed: 20,
        reference_speed: 35,
        arrows: 10000,
        arrows_size: 2,
        scale_by_magnitude: true,
        color_by_magnitude: true,
        toggle: () =>
          set((state) => {
            state.variables.winds.active = !state.variables.winds.active
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
