import { Experiments, Publication } from "./types"

export const isPublication = (
  obj: Experiments | Publication,
): obj is Publication => {
  return (obj as Publication).title != undefined
}

export function collectionEquals(
  c1: Experiments | Publication,
  c2: Experiments | Publication,
) {
  if (isPublication(c1) && isPublication(c2)) {
    return (
      c1.title === c2.title &&
      c1.authors_short === c2.authors_short &&
      c1.year === c2.year
    )
  }
  if (!isPublication(c1) && !isPublication(c2)) {
    if (c1.exps.length !== c2.exps.length) {
      return false
    } else {
      let equals = true
      let i = 0
      while (equals && i < c1.exps.length) {
        if (!c1.exps.includes(c2.exps[i])) {
          equals = false
        }
        i++
      }
      return equals
    }
  }
  return false
}

export function uniqueIdx(x: number, y: number, z: number) {
  return Math.pow(2, x) * Math.pow(5, y) * Math.pow(7, z)
}

export function cssGrid(n:number) {
  let {width,height} = gridOf(n)
  if(width === 0) {
    width = 1
  }
  if(height === 0) {
    height = 1
  }
  
  const css_width = Math.floor(width).toString()
  const css_height = Math.floor(height).toString()

  return `grid-cols-${css_width} grid-rows-${css_height}`
}

function gridOf(n:number):{width:number,height:number}{
  let factors = primeFactors(n)
  
  if(factors.length === 1 && factors[0] === 2){
    return {
      width : 2,
      height : 1,
    }
  }
  if(factors.length === 1 && factors[0] === 3){
    return {
      width : 3,
      height : 1,
    }
  }
  let i = 0
  while(factors.length === 1) {
    i += 1
    factors = primeFactors(n-i)
  }
  const [x,y] = halve(factors)
  return {
    width : x + i,
    height : y,
  }
}

function halve(arr:number[]):[number,number] {
  const middle_idx = Math.ceil(arr.length / 2);
  const first_half = arr.splice(0, middle_idx);   
  const second_half = arr.splice(-middle_idx);
  const x = first_half.reduce((acc,n)=>acc+n,0)
  const y = second_half.reduce((acc,n)=>acc+n,0)
  return [x,y]
}

function primeFactors(n:number) {
  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}