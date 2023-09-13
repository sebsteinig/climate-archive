export const GeoTreeRepr = {
  Phanerozoic: {
    age_span: { from: 0, to: 541 },
    color: "#9AD9DD",
    lvl: 1,
    branches: {
      Paleozoic: {
        age_span: { from: 252.2, to: 541 },
        color: "#99C08D",
        lvl: 2,
        branches: {
          Cambrian: {
            age_span: { from: 485.4, to: 541 },
            color: "#7FA056",
            lvl: 3,
            branches: {
              Terreneuvian: {
                age_span: { from: 521, to: 541 },
                color: "#8CB06C",
                lvl: 4,
                branches: undefined
              },
              "Series 2": {
                age_span: { from: 509, to: 521 },
                color: "#99C078",
                lvl: 4,
                branches: undefined
              },
              "Series 3": {
                age_span: { from: 497, to: 509 },
                color: "#A6CF86",
                lvl: 4,
                branches: undefined
              },
              Furongian: {
                age_span: { from: 485.4, to: 497 },
                color: "#B3E095",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Ordovician: {
            age_span: { from: 443.4, to: 485.4 },
            color: "#009270",
            lvl: 3,
            branches: {
              "Early Ordovician": {
                age_span: { from: 470, to: 485.4 },
                color: "#1A9D6F",
                lvl: 4,
                branches: undefined,
              },
              "Middle Ordovician": {
                age_span: { from: 458.4, to: 470 },
                color: "#4DB47E",
                lvl: 4,
                branches: undefined
              },
              "Late Ordovician": {
                age_span: { from: 443.4, to: 458.4 },
                color: "#7FCA93",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Silurian: {
            age_span: { from: 419.2, to: 443.4 },
            color: "#B3E1B6",
            lvl: 3,
            branches: {
              Llandovery: {
                age_span: { from: 433.4, to: 443.4 },
                color: "#99D7B3",
                lvl: 4,
                branches: undefined
              },
              Wenlock: {
                age_span: { from: 427.4, to: 433.4 },
                color: "#B3E1C2",
                lvl: 4,
                branches: undefined
              },
              Ludlow: {
                age_span: { from: 423, to: 427.4 },
                color: "#BFE6CF",
                lvl: 4,
                branches: undefined
              },
              Pridoli: {
                age_span: { from: 419.2, to: 423 },
                color: "#E6F5E1",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Devonian: {
            age_span: { from: 358.9, to: 419.2 },
            color: "#CB8C37",
            lvl: 3,
            branches: {
              "Early Devonian": {
                age_span: { from: 393.3, to: 419.2 },
                color: "#E5AC4D",
                lvl: 4,
                branches: undefined
              },
              "Middle Devonian": {
                age_span: { from: 382.7, to: 393.3 },
                color: "#F1C868",
                lvl: 4,
                branches: undefined
              },
              "Late Devonian": {
                age_span: { from: 358.9, to: 382.7 },
                color: "#F1E19D",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Carboniferous: {
            age_span: { from: 298.9, to: 358.9 },
            color: "#67A599",
            lvl: 3,
            branches: {
              Mississippian: {
                age_span: { from: 323.2, to: 358.9 },
                color: "#678F66",
                lvl: 4,
                branches: undefined
              },
              Pennsylvanian: {
                age_span: { from: 298.9, to: 323.2 },
                color: "#99C2B5",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Permian: {
            age_span: { from: 252.2, to: 298.9 },
            color: "#F04028",
            lvl: 3,
            branches: {
              Cisuralian: {
                age_span: { from: 272.3, to: 298.9 },
                color: "#EF5845",
                lvl: 4,
                branches: undefined
              },
              Guadalupian: {
                age_span: { from: 259.9, to: 272.3 },
                color: "#FB745C",
                lvl: 4,
                branches: undefined
              },
              Lopingian: {
                age_span: { from: 252.2, to: 259.9 },
                color: "#FBA794",
                lvl: 4,
                branches: undefined
              },
            },
          },
        },
      },
      Mesozoic: {
        age_span: { from: 66, to: 252.2 },
        color: "#67C5CA",
        lvl: 2,
        branches: {
          Triassic: {
            age_span: { from: 201.3, to: 252.2 },
            color: "#812B92",
            lvl: 3,
            branches: {
              "Early Triassic": {
                age_span: { from: 247.2, to: 252.2 },
                color: "#983999",
                lvl: 4,
                branches: undefined
              },
              "Middle Triassic": {
                age_span: { from: 237, to: 247.2 },
                color: "#B168B1",
                lvl: 4,
                branches: undefined
              },
              "Late Triassic": {
                age_span: { from: 201.3, to: 237 },
                color: "#BD8CC3",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Jurassic: {
            age_span: { from: 145, to: 201.3 },
            color: "#34B2C9",
            lvl: 3,
            branches: {
              "Early Jurassic": {
                age_span: { from: 174.1, to: 201.3 },
                color: "#42AED0",
                lvl: 4,
                branches: undefined
              },
              "Middle Jurassic": {
                age_span: { from: 163.5, to: 174.1 },
                color: "#80CFD8",
                lvl: 4,
                branches: undefined
              },
              "Late Jurassic": {
                age_span: { from: 145, to: 163.5 },
                color: "#B3E3EE",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Cretaceous: {
            age_span: { from: 66, to: 145 },
            color: "#7FC64E",
            lvl: 3,
            branches: {
              "Early Cretaceous": {
                age_span: { from: 100.5, to: 145 },
                color: "#8CCD57",
                lvl: 4,
                branches: undefined
              },
              "Late Cretaceous": {
                age_span: { from: 66, to: 100.5 },
                color: "#A6D84A",
                lvl: 4,
                branches: undefined
              },
            },
          },
        },
      },
      Cenozoic: {
        age_span: { from: 0, to: 66 },
        color: "#F2F91D",
        lvl: 2,
        branches: {
          Paleogene: {
            age_span: { from: 23.03, to: 66 },
            color: "#FD9A52",
            lvl: 3,
            branches: {
              Paleocene: {
                age_span: { from: 56, to: 66 },
                color: "#FDA75F",
                lvl: 4,
                branches: undefined
              },
              Eocene: {
                age_span: { from: 33.9, to: 56 },
                color: "#FDB46C",
                lvl: 4,
                branches: undefined
              },
              Oligocene: {
                age_span: { from: 23.03, to: 33.9 },
                color: "#FDC07A",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Neogene: {
            age_span: { from: 2.588, to: 23.03 },
            color: "#FFE619",
            lvl: 3,
            branches: {
              Miocene: {
                age_span: { from: 5.333, to: 23.03 },
                color: "#FFFF00",
                lvl: 4,
                branches: undefined
              },
              Pliocene: {
                age_span: { from: 2.588, to: 5.333 },
                color: "#FFFF99",
                lvl: 4,
                branches: undefined
              },
            },
          },
          Quaternary: {
            age_span: { from: 0, to: 2.588 },
            color: "#F9F97F",
            lvl: 3,
            branches: {
              Pleistocene: {
                age_span: { from: 0.0117, to: 2.588 },
                color: "#FFF2AE",
                lvl: 4,
                branches: undefined
              },
              Holocene: {
                age_span: { from: 0, to: 0.0117 },
                color: "#FEF2E0",
                lvl: 4,
                branches: undefined
              },
            },
          },
        },
      },
    },
  },
} as const
