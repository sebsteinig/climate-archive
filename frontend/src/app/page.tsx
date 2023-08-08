//'use client'
import dynamic from "next/dynamic"
import styles from "./page.module.css"
import SelectJournal from "@/components/searchbar/filters/SelectJournals"
import { useClusterStore } from "@/utils/store/cluster.store"
import { usePathname } from "next/navigation"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useRouter } from "next/router"
import { SearchButton } from "@/components/searchbar/SearchButton"
import { SearchButtonComplete } from "@/components/searchbar/SearchButtonComplete"
import Link from "next/link"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import Image from "next/image"

// const ClientMain = dynamic(() => import("@/components/ClientMain"), {
//   ssr: false,
// })
export default function Home() {
  // const addCollection = useClusterStore((state) => state.addCollection)
  // const add = useClusterStore((state) => state.time.add)
  // const clear = useClusterStore((state) => state.time.clear)
  // useEffect(() => {
  //   clear()
  //   Promise.all([database_provider.loadAllColections()]).then(([e]) => {
  //     e.map((element) => {
  //       addCollection(element.id!, element.data)
  //     })
  //     const most_recent = e.sort(
  //       (a, b) => Date.parse(b.date) - Date.parse(a.date),
  //     )[0]
  //     if (most_recent) {
  //       add(most_recent.data)
  //     }
  //   })
  // }, [])

  return (
    <main id="root" className="w-full h-full">
      {/* <ClientMain /> */}
      <div className="flex flex-col w-full h-full gap-5">
        <nav className="flex flex-row justify-between">
          <SearchButtonComplete />
                        
            <div className="h-14 cursor-pointer flex items-center">
              <h1 className="">CLIMATE ARCHIVE</h1>
            </div>
        </nav>

        <div className="grow grid grid-cols-3 gap-5">

          <div className="col-span-2 flex flex-col gap-5">
            <div className="grow grid grid-rows-2 gap-5">
              <div className="h-full">
                <div className="transition-colors duration-300 hover:bg-slate-700 p-5 rounded-lg h-full bg-slate-800 border-2 border-slate-900  flex flex-row gap-5">
                  <div className="grow-0 w-3/5 flex justify-center items-center">
                    <Image width={499} height={466} alt="" src={"/assets/world-test.png"} />
                  </div>
                  <div className="grow flex flex-col gap-5 ">
                    <h2 className="text-slate-300 tracking-[.5em] small-caps">weather</h2>
                    <p className="text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur neque assumenda ex sapiente repudiandae ab odit voluptates corrupti dolore perferendis, praesentium recusandae dicta quisquam, nulla laudantium placeat, veniam beatae alias.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="p-5 rounded-lg h-full bg-slate-900 flex flex-col gap-5">
                  <h2 className="text-slate-300 tracking-[.5em] small-caps">fantasy worlds</h2>
                  <div className="grid grid-cols-2 gap-5 w-full h-full">
                    <p className="text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur neque assumenda ex sapiente repudiandae ab odit voluptates corrupti dolore perferendis, praesentium recusandae dicta quisquam, nulla laudantium placeat, veniam beatae alias.</p>
                    <div className="flex justify-center items-center">
                      <Image width={499} height={466} alt="" src={"/assets/world-test.png"} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="border-l-4 border-sky-500 w-full p-5">
                    <h2 className="text-slate-300 tracking-[.5em] small-caps">prediction</h2>
                  </div>

                </div>
              </div>
            </div>
            <div className="grow-0 shrink-0">
              <footer className="rounded-lg bg-slate-900 flex flex-row gap-5 p-5 justify-evenly">
                <Link href={""} className="tracking-[.5em] uppercase text-slate-300">ABOUT US</Link>
                <Link href={""} className="tracking-[.5em] uppercase text-slate-300">FEEDBACK</Link>
                <Link href={""} className="tracking-[.5em] uppercase text-slate-300">BRIDGE COMMUNITY</Link>
              </footer>
            </div>
          </div>
          <div className="col-start-3">
            <div className="p-5 rounded-lg h-full bg-slate-950 flex flex-col justify-between items-center">
              <h2 className="text-slate-300 tracking-[.5em] small-caps">paleoclimate</h2>
              <div className="p-5 w-full">
                <Image width={499} height={466} alt="" src={"/assets/world-test.png"} />
              </div>
              <p className="text-slate-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur neque assumenda ex sapiente repudiandae ab odit voluptates corrupti dolore perferendis, praesentium recusandae dicta quisquam, nulla laudantium placeat, veniam beatae alias.</p>
              <Link href={""} 
              className="bg-emerald-500 w-fit px-5 py-4 rounded-lg
                outline-none
                tracking-[.5em] uppercase text-slate-900"
              >Discover</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
