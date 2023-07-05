import { useState } from "react"
import { fetchJournals, select } from "@/utils/api/api"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"

const DEFAULT_LOWER = "jurassic"
const DEFAULT_UPPER = "now"
const LOWER_PERIOD = rangeYear(1970,new Date().getFullYear(), DEFAULT_LOWER, false)
const UPPER_PERIOD = rangeYear(1970,new Date().getFullYear(), DEFAULT_UPPER, true)

function Period({period, setYearLower, setYearUpper} : {period:boolean, setYearLower:Function, setYearUpper:Function}) {
    if (period) {    
        return (
            <>
                <Select name="period_lower" id="period_lower" onChange={(e : any) => {
                        if(e.target.value === DEFAULT_LOWER) {
                            setYearLower(1900)
                        } else{
                            setYearLower(parseInt(e.target.value))
                        }
                    }}>
                    {LOWER_PERIOD.map((year,index) => {
                        return <option key = {index} value = {year}>{year}</option>
                    })}
                </Select>

                <h4  > and </h4>
                    <Select name="period_upper" id="period_upper" onChange={(e : any) => {
                        if(e.target.value === DEFAULT_UPPER) {
                            setYearUpper(new Date().getFullYear())
                        } else{
                            setYearUpper(parseInt(e.target.value))
                        }
                    }}>
                        {UPPER_PERIOD.map((year,index) => {
                                return <option key = {index} value = {year}>{year}</option>
                        })}
                    </Select>
            </>
        )
    }
    return (
        <Select name="period_upper" id="period_upper" onChange={(e : any) => {
            if(e.target.value === DEFAULT_UPPER) {
                setYearUpper(new Date().getFullYear())
            } else{
                setYearUpper(parseInt(e.target.value))
            }
        }}>
            {UPPER_PERIOD.map((year,index) => {
                    return <option key = {index} value = {year}>{year}</option>
            })}
        </Select>
    )
}

export default function FilterPublication() {
    const [display_filters, setDisplayFilters] = useState(false)
    const [on_period, setOnPeriod] = useState(true)    
    const [year_lower, setYearLower] = useState(1900)
    const [year_upper, setYearUpper] = useState(new Date().getFullYear())
    const [journal, setJournal] = useState("")
    const [author, setAuthor] = useState("")
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
                <ButtonSecondary onClick={() => setOnPeriod((prev) => !prev)}> {on_period ?"Between" : "Exactly"}</ButtonSecondary>
                <Period period={on_period} setYearLower={setYearLower} setYearUpper={setYearUpper}/>
                {on_period && year_lower > year_upper && <h4 color="red">Please enter a valid period</h4>}
            </div>
            <div  >
                <h4 >Journal : </h4>
                <Select defaultValue={journal} onChange={(e : any) => { setJournal(e.target.value)}}>
                    {journals.map((journal : string, index) => 
                        <option key = {index} value = {journal}>{journal}</option>)}
                </Select>
            </div>
            <div  >
                <h4 >Author : </h4>
                <InputField  placeholder="like valdes et al" value = {author} 
                onChange={(e : any) => setAuthor(e.target.value)}></InputField>
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