import { useState } from "react"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
import InputField from "@/components/inputs/InputField"
import Select from "@/components/inputs/Select"
import { SearchPublication } from "@/utils/api/api.types"
import Image from 'next/image';
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg";
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg";

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
            <div className="flex flex-wrap items-center pt-3 gap-3">
            <div className="w-1/6"> <h4>Year : </h4> </div>
                <ButtonSecondary onClick={() => setOnPeriod((prev) => !prev)}> {on_period ?"Between" : "Exactly"}</ButtonSecondary>
                <div className="w-1/5">                
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
                </div>

                <h4  > and </h4>
                <div className="w-1/5"> 
                <Select defaultValue={`${year_upper}`} name="period_upper" id="period_upper" onChange={(e : any) => {
                    let new_year = e.target.value !== DEFAULT_LOWER?parseInt(e.target.value) : new Date().getFullYear()
                    const yl = year_lower === DEFAULT_UPPER ? 1900 : parseInt(year_lower.toString())
                    onChange([yl,new_year])
                    setYearUpper(new_year)}}>
                    {UPPER_PERIOD.map((year,index) => {
                            return <option key = {index} value = {year}>{year}</option>
                    })}
                </Select>
                </div>
            </div>
            </>
        )
    }
    return (
        <>        
        <div className="flex flex-wrap items-center pt-3 gap-3">
        <div className="w-1/6"> <h4>Year : </h4> </div>
            <ButtonSecondary onClick={() => setOnPeriod((prev) => !prev)}> {on_period ?"Between" : "Exactly"}</ButtonSecondary>
            <div className="w-1/5"> 
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
            </div>
        </div>
        </>
    )
}

export default function FilterPublication({filters, children, setRequestFilters}:{filters:SearchPublication, children:React.ReactNode, setRequestFilters:(filters:SearchPublication) => void}) {
    const [display_filters, setDisplayFilters] = useState(true)
    const [journal, setJournal] = useState(filters.journal ?? "")
    const [author, setAuthor] = useState(filters.authors_short ?? "")
    if (!display_filters){
        return (
            <span onClick={() => {setDisplayFilters(true)}} className="inline-flex" >
                <h3 >Filter on publication</h3>
                <Image
                    priority
                    alt='open'
                    className={`w-4 h-4 self-center ml-4`}
                    src={ArrowDown} 
                />
            </span>
        )
    } else {
        return (
            <>
            <span  onClick={() => {setDisplayFilters(false)}} className="inline-flex" >
                <h3 >Filter on publication</h3>
                <Image
                    priority
                    alt='open'
                    className={`w-4 h-4 self-center ml-4`}
                    src={ArrowUp} 
                />
            </span>
            
            <Period year={filters.year} onChange={
                (year) => {
                    setRequestFilters({year})
                }
            }/>

            <div className="flex flex-wrap items-center gap-3 pt-3 ">            
                <div className="w-1/6"><h4>Journal : </h4></div> 
                <div className="w-3/4">
                <Select defaultValue={journal} 
                    onChange={(e : any) => { 
                        setJournal(e.target.value);
                        setRequestFilters({journal:e.target.value})
                    }}>{children}</Select>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 pb-3 ">
                <div className="w-1/6"><h4>Author : </h4></div>
                <div className="w-3/4">
                <InputField  placeholder="like valdes et al" value = {author} 
                onChange={(e : any) => {
                    setAuthor(e.target.value);
                    setRequestFilters({authors_short:e.target.value})
                }}></InputField></div>
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