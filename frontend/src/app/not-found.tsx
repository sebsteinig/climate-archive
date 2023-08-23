import { SearchButtonStatic } from '@/components/searchbar/SearchButtonStatic'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='w-full h-full flex flex-col gap-5'>
      <div>
        <nav className="flex flex-row justify-between">
          <SearchButtonStatic />
          <div className="h-14 cursor-pointer flex items-center">
            <h1 className="">CLIMATE ARCHIVE</h1>
          </div>
        </nav>
      </div>
      <div className='w-full h-full flex flex-col gap-5 justify-center items-center'>
        <h1 className='font-bold text-center small-caps text-5xl'>404: Page Not Found</h1>
        <h2 className='text-center text-slate-300'>
          Oops! The page you're looking for seems to have gone on an adventure.
          <br/> 
          It might have been moved, deleted, or perhaps it never existed.
        </h2>
      <ul>
        <p>Let's get you back on track:</p>
        <li className='pl-5'>Check the URL to make sure it's correct.</li>
        <li className='pl-5'>Use the search bar to find what you're looking for.</li>
        <li className='pl-5'>Head back to our <Link
          href={"/"}
          className='cursor-pointer text-emerald-500 tracking-widest small-caps'
        >home page</Link>.</li>
        <li className='pl-5'>Still lost? Our support team is here to help. <Link
          href={"/"}
          className='cursor-pointer text-sky-500 tracking-widest small-caps'
        >Contact Support</Link></li>
      </ul>
      <p>Thanks for your understanding!.</p>
      </div>
    </main>
  )
}