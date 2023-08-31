import { SearchButton } from "../searchbar/SearchButton"

type ErrorViewProps = {
  try_again_path: string
}

export function ErrorView({ try_again_path }: ErrorViewProps) {
  return (
    <main className="w-full h-full flex flex-col gap-5">
      <div>
        <nav className="flex flex-row justify-between">
          <SearchButton />
          <div className="h-14 cursor-pointer flex items-center">
            <h1 className="">CLIMATE ARCHIVE</h1>
          </div>
        </nav>
      </div>
      <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
        <h1 className="font-bold text-center small-caps text-5xl">
          Something went wrong!
        </h1>
        <p className="text-center">
          We're sorry for the inconvenience.
          <br /> Our team is already on the case, working hard to fix the issue.
          <br />
          <a
            href={try_again_path}
            className="cursor-pointer p-5 text-sky-500 tracking-widest small-caps"
          >
            Please try again
          </a>
          .<br />
          If the problem persists, feel free to contact our support team.
        </p>
        <a
          href={"/"}
          className="cursor-pointer text-emerald-500 tracking-widest small-caps"
        >
          or go back home
        </a>
      </div>
    </main>
  )
}
