"use client"

import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import ButtonSecondary from "@/components/buttons/ButtonSecondary"
// import { SearchButtonStatic } from "@/components/searchbar/SearchButtonStatic"
import { SearchButton } from "@/components/searchbar/SearchButton"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="w-full h-full flex flex-col gap-5">
      <div>
        <nav className="flex flex-row justify-between">
          {/* <SearchButtonStatic /> */}
          {/* <SearchButton /> */}
          <div className="h-14 cursor-pointer flex items-center">
            <h1 className="">CLIMATE ARCHIVE</h1>
          </div>
        </nav>
      </div>
      <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
        <h1 className="font-bold text-center small-caps text-5xl">
           wrong!
        </h1>
        <p className="text-center">
          We're sorry for the inconvenience.
          <br /> Our team is already on the case, working hard to fix the issue.
          Please try again.
          <br />
          If the problem persists, feel free to contact our support team.
        </p>
        <ButtonSecondary onClick={() => reset()}>Try again</ButtonSecondary>
        <Link
          href={"/"}
          className="cursor-pointer text-emerald-500 tracking-widest small-caps"
        >
          or go back home
        </Link>
      </div>
    </main>
  )
}
