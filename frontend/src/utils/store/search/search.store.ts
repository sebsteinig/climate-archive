import { StateCreator } from "zustand"

export type PublicationFilters = {
    year_span : {
        from : number | null,
        to : number | null,
        period : boolean,
    }
    author : string | null,
    journal : string | null,
}
export type ExperimentFilters = {
    exp_ids : string[] | null,
    config : string | null,
    extension : string | null,
    lossless : boolean | null,
    resolution : { x: number; y: number } | null,
    variables : string[] | null
}
export interface SearchSlice {
    search : {
        filter : {
            publication : PublicationFilters,
            experiment : ExperimentFilters,
        },
        setFrom : (year : number) => void,
        setTo : (year : number) => void,
        togglePeriod : () => void,
        setAuthor: (author : string) => void,
        setJournal : (journal : string) => void,
        pushExp : (exp_id:string) => void,
        pushVar : (variable:string) => void,
        removeExp : (exp_id:string) => void,
        removeVar : (variable:string) => void,
        setExtension: (extension:string) =>void,
        toggleLossless : () => void
        setResolution : (x:number,y:number) => void,
        setConfig : (config:string) => void,
        clearFiltersPublication : () => void
    }
}
  
export const createSearchSlice: StateCreator<
    SearchSlice,
    [["zustand/immer", never]],
    [],
    SearchSlice
  > = (set) => {
    return {
        search : {
            filter : {
                publication : {
                    year_span : {
                        from : null,
                        to : null,
                        period : true,
                    },
                    author : null,
                    journal : null,
                },
                experiment : {
                    exp_ids : null,
                    config : null,
                    extension : "webp",
                    lossless : null,
                    resolution : null,
                    variables : null,
                }
            },
            setFrom(year) {
                set(state => {
                    state.search.filter.publication.year_span.from = year
                })
            },
            setTo(year) {
                set(state => {
                    state.search.filter.publication.year_span.to = year
                })
            },
            togglePeriod() {
                set(state => {
                    state.search.filter.publication.year_span.period = !state.search.filter.publication.year_span.period
                })
            },
            setAuthor(author) {
                set(state => {
                    state.search.filter.publication.author = author
                })
            },
            setJournal(journal) {
                set(state => {
                    state.search.filter.publication.journal = journal
                })
            },
            pushExp(exp_id) {
                set(state => {
                    if(!state.search.filter.experiment.exp_ids) {
                        state.search.filter.experiment.exp_ids = []
                    }
                    if(state.search.filter.experiment.exp_ids.includes(exp_id)) return
                    state.search.filter.experiment.exp_ids.push(exp_id)
                })
            },
            removeExp(exp_id) {
                set(state => {
                    const idx = state.search.filter.experiment.exp_ids?.indexOf(exp_id)
                    if(idx !== undefined) {
                        state.search.filter.experiment.exp_ids?.splice(idx,1)
                    }
                    if(state.search.filter.experiment.exp_ids?.length === 0) {
                        state.search.filter.experiment.exp_ids = null
                    }
                })
            },
            pushVar(variable) {
                set(state => {
                    if(!state.search.filter.experiment.variables) {
                        state.search.filter.experiment.variables = []
                    }
                    if(state.search.filter.experiment.variables.includes(variable)) return
                    state.search.filter.experiment.variables.push(variable)
                })
            },
            removeVar(variable) {
                set(state => {
                    const idx = state.search.filter.experiment.variables?.indexOf(variable)
                    if(idx) {
                        state.search.filter.experiment.variables?.splice(idx,1)
                    }
                    if(state.search.filter.experiment.variables?.length === 0) {
                        state.search.filter.experiment.variables = null
                    }
                })
            },
            setConfig(config) {
                set(state => {
                    state.search.filter.experiment.config = config
                })
            },
            setExtension(extension) {
                set(state => {
                    state.search.filter.experiment.extension = extension
                })
            },
            setResolution(x, y) {
                set(state => {
                    state.search.filter.experiment.resolution = {
                        x,
                        y,
                    }
                })
            },
            toggleLossless() {
                set(state => {
                    state.search.filter.experiment.lossless = !state.search.filter.experiment.lossless
                })
            },
            clearFiltersPublication(){
                set(state => {
                    state.search.filter.publication.author = null
                    state.search.filter.publication.year_span = {
                        from : null,
                        to : null,
                        period : true,
                    }
                    state.search.filter.publication.journal = null
                })
            }
        }
    }
  }