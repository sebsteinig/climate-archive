import { useState } from "react"
import { fetchJournals, select } from "@/utils/api/api"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"
import { SearchPublication } from "@/utils/api/types"

const DEFAULT_LOWER = "jurassic"
const DEFAULT_UPPER = "now"
const LOWER_PERIOD = rangeYear(1970,new Date().getFullYear(), DEFAULT_LOWER, false)
const UPPER_PERIOD = rangeYear(1970,new Date().getFullYear(), DEFAULT_UPPER, true)

function Period({year,onChange} : {year?:number[] , onChange:(year:number[]) => void}) {
    const [on_period, setOnPeriod] = useState((!year || year.length > 1))    
    const [year_lower, setYearLower] = useState(year && year[0] || DEFAULT_LOWER)
    const [year_upper, setYearUpper] = useState(year && year[1] || DEFAULT_UPPER)
    if (on_period) {    
        return (
            <>
                <ButtonSecondary onClick={() => setOnPeriod((prev) => !prev)}> {on_period ?"Between" : "Exactly"}</ButtonSecondary>
                <Select defaultValue={`${year_lower}`} name="period_lower" id="period_lower" onChange={(e : any) => {
                        let new_year = 1900
                        if(e.target.value !== DEFAULT_LOWER) {
                            new_year = parseInt(e.target.value)
                        }
                        const yu = year_upper === DEFAULT_UPPER ? new Date().getFullYear() : parseInt(year_upper.toString())
                        onChange([new_year,yu])
                        setYearLower(new_year)
                    }}>
                    {LOWER_PERIOD.map((year,index) => {
                        return <option key = {index} value = {year}>{year}</option>
                    })}
                </Select>

                <h4  > and </h4>
                    <Select defaultValue={`${year_upper}`} name="period_upper" id="period_upper" onChange={(e : any) => {
                        let new_year = new Date().getFullYear()
                        if(e.target.value !== DEFAULT_LOWER) {
                            new_year = parseInt(e.target.value)
                        }
                        const yl = year_lower === DEFAULT_UPPER ? 1900 : parseInt(year_lower.toString())
                        onChange([yl,new_year])
                        setYearUpper(new_year)
                    }}>
                        {UPPER_PERIOD.map((year,index) => {
                                return <option key = {index} value = {year}>{year}</option>
                        })}
                    </Select>
            </>
        )
    }
    return (
        <>
            <ButtonSecondary onClick={() => setOnPeriod((prev) => !prev)}> {on_period ?"Between" : "Exactly"}</ButtonSecondary>
            <Select defaultValue={`${year_upper}`} name="period_upper" id="period_upper" onChange={(e : any) => {
                let new_year = new Date().getFullYear()
                if(e.target.value !== DEFAULT_LOWER) {
                    new_year = parseInt(e.target.value)
                }
                const yl = year_lower === DEFAULT_UPPER ? 1900 : parseInt(year_lower.toString())
                onChange([yl,new_year])
                setYearUpper(new_year)
            }}>
                {UPPER_PERIOD.map((year,index) => {
                        return <option key = {index} value = {year}>{year}</option>
                })}
            </Select>
        </>
    )
}

export default function FilterPublication({filters,setRequestFilters}:{filters:SearchPublication,setRequestFilters:(filters:SearchPublication) => void}) {
    const [display_filters, setDisplayFilters] = useState(false)
    const [journal, setJournal] = useState(filters.journal ?? "")
    const [author, setAuthor] = useState(filters.authors_short ?? "")
    if (!display_filters){
        return (
            <>
            <span onClick={() => {setDisplayFilters(true)}}>
                <h3 >Filter on publication</h3>
            </span>
            </>
        )
    } else {
        let journals = fetchJournals()
        return (
            <>
            <span  onClick={() => {setDisplayFilters(false)}}>
                <h3 >Filter on publication</h3>
            </span>
            <div   >
                <h4 >Year : </h4> 
                <Period year={filters.year} onChange={
                    (year) => {
                        setRequestFilters({year})
                    }
                }/>
            </div>
            <div  >
                <h4 >Journal : </h4>
                <Select defaultValue={journal} 
                    onChange={(e : any) => { 
                        setJournal(e.target.value);
                        setRequestFilters({journal:e.target.value})
                    }
                }>
                    {journals.map((journal : string, index) => 
                        <option key = {index} value = {journal}>{journal}</option>)}
                </Select>
            </div>
            <div  >
                <h4 >Author : </h4>
                <InputField  placeholder="like valdes et al" value = {author} 
                onChange={(e : any) => {
                    setAuthor(e.target.value);
                    setRequestFilters({authors_short:e.target.value})
                }}></InputField>
            </div>
            </>
        )
    }
}

function rangeYear(startAt:number, endAt:number,default_value:string, reverse : boolean) {
    let res = [default_value]    
    if (!reverse){
        for (let index = startAt; index <= endAt; index++){
            res.push(index.toString())
        }
    }else {
        for (let index = endAt; index >= startAt; index--){
            res.push(index.toString())
        }
    }
    return res
}