"use client"

import { TimeScale } from "@/components/geologic_timescale/TimeScale"
import { useState } from "react"

export default function Page() {
  return (
    <div className="w-full h-full">
      <TimeScale />
    </div>
  )
}

// export default function Page() {
//     const [showLeft, setShowLeft] = useState(true);

//     return (
//       <div className="w-full h-full">
//         {`${showLeft}`}
//         <div className="w-full border-2 border-red-500 flex flex-row overflow-hidden">
//           <div
//             className={`${showLeft ? "grow" : "grow-0"} transition-all duration-100 ease-in-out grow flex`}
//           > {
//             showLeft &&
//             <>
//                 <div className="min-w-[1em] grow  transition-all duration-100 ease-in-out bg-lime-500">T1</div>
//                 <div className="min-w-[1em] grow  bg-cyan-500">T2</div>
//             </>
//           }
//             <div className={`min-w-[1em] ${showLeft ? "grow" : ""}  transition-all duration-100 ease-in-out bg-rose-500`} onClick={() => setShowLeft(true)}>T3</div>
//           </div>

//           <div className={`${showLeft ? "" : "grow"}  transition-all duration-100 ease-in-out  bg-amber-500 cursor-pointer`} onClick={() => setShowLeft(false)}>T4</div>
//           <div className={`${showLeft ? "" : "grow"}  transition-all duration-100 ease-in-out  bg-red-600`}>T5</div>
//           <div className={`${showLeft ? "" : "grow"}   transition-all duration-100 ease-in-out bg-green-500`}>T6</div>
//         </div>
//       </div>
//     );
//   }

// export default function Page() {
//     const [invisible,setInvisible] = useState(false)
//     return (
//         <div className="w-full h-full">
//             <div className="w-full border-2 border-red-500 flex flex-row overflow-hidden">
//                 <div className={`${invisible ? "":"grow"} transition-all duration-100 ease-in-out  min-w-[1em] bg-lime-500`}>{invisible ? "" : "T1"}</div>
//                 <div className={`grow transition-all duration-100 ease-in-out  bg-cyan-500`} onClick={() => {
//                     setInvisible(prev => !prev)
//                 }}>T2</div>
//                 <div className={`${invisible ? "":"grow"} transition-all duration-100 ease-in-out min-w-[1em] bg-rose-500`}>{invisible ? "" : "T2"}</div>
//                 <div className="bg-amber-500">T4</div>
//                 <div className="bg-red-600">T5</div>
//                 <div className="bg-green-500">T6</div>
//             </div>
//         </div>
//     )
// }
