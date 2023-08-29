export type Experiment = {
  id: string
  metadata: {
    label: string
    metadata:
      | {
          text: string
        }
      | {
          age: string
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


export type ExperimentInfo = {
  available_variables:string[],
  config_name : string,
  created_at : string,
  exp_id : string
}