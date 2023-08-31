"use client"
import { useStore } from "@/utils/store/store"
import Link from "next/link"
import { PropsWithChildren, useState } from "react"

type DefaultViewProps = {}

export function DefaultView({ children }: PropsWithChildren<DefaultViewProps>) {
  const size = useStore((state) => state.worlds.slots.size)
  if (size > 0) return children

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow-0 self-end">
        <Link
          href={"/"}
          className="overflow-hidden h-14 cursor-pointer flex items-center"
        >
          <h1 className="">CLIMATE ARCHIVE</h1>
        </Link>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <div>
          <h1 className="font-bold text-center small-caps text-5xl">
            Nothing to see here !
          </h1>
          <br />
          <p className="text-center">
            Try searching for the publication using our handy search bar up top,
            <br /> or simply head back to our{" "}
            <Link
              href={"/"}
              className="cursor-pointer text-emerald-500 tracking-widest small-caps"
            >
              homepage
            </Link>
            . Safe travels!{" "}
          </p>
        </div>
      </div>
    </div>
  )
}
