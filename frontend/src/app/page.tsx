//'use client'
import dynamic from "next/dynamic"
import styles from "./page.module.css"
import SelectJournal from "@/components/searchbar/filters/SelectJournals"
import { useStore } from "@/utils/store/store"
import { usePathname } from "next/navigation"
import { database_provider } from "@/utils/database_provider/DatabaseProvider"
import { useRouter } from "next/router"
import { SearchButton } from "@/components/searchbar/SearchButton"
import { SearchButtonStatic } from "@/components/searchbar/SearchButtonStatic"
import Link from "next/link"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import Image from "next/image"
import { Reset } from "@/components/Reset"

// const ClientMain = dynamic(() => import("@/components/ClientMain"), {
//   ssr: false,
// })
export default function Home() {
  // const addCollection = useStore((state) => state.addCollection)
  // const add = useStore((state) => state.worlds.add)
  // const clear = useStore((state) => state.worlds.clear)
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
      <Reset />
      {/* <ClientMain /> */}
      <div className="w-full h-full overflow-hidden flex flex-col gap-5">
        <nav className="flex flex-row justify-between">
          <SearchButtonStatic />

          <Link href={"/"} className="overflow-hidden h-14 cursor-pointer flex items-center">
            <h1 className="">CLIMATE ARCHIVE</h1>
          </Link>
        </nav>

        <div className="grow grid grid-cols-2 gap-5">
          <div className="">
            <div className="p-5 rounded-lg h-full bg-slate-950 flex flex-col justify-between items-center">
              <h2 className="text-slate-300 tracking-[.5em] small-caps">
                paleoclimate
              </h2>
              <div className=" w-1/2">
                <Image
                  width={499}
                  height={466}
                  alt=""
                  src={"/assets/world-test.png"}
                />
              </div>
              <p className="text-slate-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur neque assumenda ex sapiente repudiandae ab odit
                voluptates corrupti dolore perferendis, praesentium recusandae
                dicta quisquam, nulla laudantium placeat, veniam beatae alias.
              </p>
              <Link
                href={"/paleoclimate"}
                className="bg-emerald-500 w-fit px-5 py-4 rounded-lg
                  outline-none
                  tracking-[.5em] uppercase text-slate-900"
              >
                Discover
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grow flex flex-col gap-5 ">
              <div className="grow w-full">
                <div className="border-l-4 border-sky-500 bg-slate-900 w-full p-5">
                  <h2 className="text-slate-300 tracking-[.5em] small-caps">
                    prediction
                  </h2>
                </div>
                <p className="p-5">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Voluptatibus quam maxime in, hic voluptatem rerum quae! Non
                  atque ut numquam.
                </p>
                <div className="p-5 flex flex-col gap-5">
                  <Link
                    href={""}
                    className="text-right tracking-[.5em] py-5 transition-colors duration-300 uppercase text-slate-300 hover:text-emerald-500"
                  >
                    next 80 years
                  </Link>
                  <Link
                    href={""}
                    className="tracking-[.5em] uppercase py-5 transition-colors duration-300 text-slate-300 hover:text-emerald-500"
                  >
                    next millions years
                  </Link>
                </div>
              </div>
              {/* <div className=" border-blue-500">

              </div> */}
              <div className="grow overflow-hidden 
                  flex flex-row gap-5 w-full p-5 
                  rounded-lg h-full bg-slate-700">
                  <div className="flex flex-col gap-5">
                    <h2 className="text-slate-300 tracking-[.5em] small-caps">
                      fantasy worlds
                    </h2>
                    <p className="text-slate-400">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Consequatur neque assumenda ex sapiente repudiandae ab
                      odit voluptates corrupti dolore perferendis, praesentium
                      recusandae dicta quisquam, nulla laudantium placeat,
                      veniam beatae alias.
                    </p>
                  </div>
                  <div className="w-full h-fit">
                    <Image
                      width={499}
                      height={466}
                      alt=""
                      src={"/assets/world-test.png"}
                    />
                  </div>
                </div>
            </div>
            <div className="grow-0 shrink-0  ">
              <div className="rounded-lg bg-slate-900 flex flex-row gap-5 p-5 justify-evenly">
                <Link
                  href={""}
                  className="tracking-[.5em] uppercase text-slate-300"
                >
                  ABOUT US
                </Link>
                <Link
                  href={""}
                  className="tracking-[.5em] uppercase text-slate-300"
                >
                  FEEDBACK
                </Link>
                <Link
                  href={""}
                  className="tracking-[.5em] uppercase text-slate-300"
                >
                  BRIDGE COMMUNITY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
