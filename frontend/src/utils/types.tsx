export type Experiment = {
  id: string
  metadata: {
    label: string
    metadata:
      | {
          text: string
        }
      | any
  }[]
}

export type Publication = {
  title: string
  authors_short: string
  year: number
  authors_full: string
  abstract: string
  journal: string
  exps: Experiment[]
}

export type Experiments = {
  exps: Experiment[]
}
